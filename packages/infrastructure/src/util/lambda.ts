import path from "path";

import { Json, Route } from "@algwiki/routes";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import webpack from "webpack";

const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, "dist-pulumi");

let cachedDefaultLambdaRole: aws.iam.Role | undefined;
const getDefaultLambdaRole = (table: aws.dynamodb.Table): aws.iam.Role => {
  if (cachedDefaultLambdaRole) return cachedDefaultLambdaRole;
  const defaultLambdaRole = new aws.iam.Role("default-lambda-role", {
    assumeRolePolicy: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: "sts:AssumeRole",
          Principal: {
            Service: "lambda.amazonaws.com",
          },
        },
      ],
    },
    inlinePolicies: [
      {
        name: "LambdaRoute",
        policy: table.arn.apply((arn) =>
          JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "DbWrite",
                Effect: "Allow",
                Action: [
                  "dynamodb:PutItem",
                  "dynamodb:UpdateItem",
                  "dynamodb:DeleteItem",
                  "dynamodb:BatchWriteItem",
                  "dynamodb:GetItem",
                  "dynamodb:BatchGetItem",
                  "dynamodb:Query",
                  "dynamodb:ConditionCheckItem",
                ],
                Resource: [arn, `${arn}/index/*`],
              },
              {
                Sid: "ReadSecrets",
                Effect: "Allow",
                Action: "ssm:GetParameter",
                Resource: "arn:aws:ssm:*:*:parameter/*",
              },
            ],
          })
        ),
      },
    ],
  });
  new aws.iam.RolePolicyAttachment("default-lambda-role-attach", {
    role: defaultLambdaRole,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaExecute,
  });
  cachedDefaultLambdaRole = defaultLambdaRole;
  return defaultLambdaRole;
};

interface LambdaData {
  path: string;
  route: Route<Json, Json>;
  lambda: aws.lambda.Function;
  assetArchive?: pulumi.asset.AssetArchive;
}
const routeLambdas = new Map<Route<Json, Json>, LambdaData>();
const uncompiledRoutes = new Set<LambdaData>();

const compileRoutes = (): Promise<void> =>
  new Promise((resolve, reject) => {
    const uncompiledRouteList = [...uncompiledRoutes];
    const compiler = webpack(
      uncompiledRouteList.map(
        (data): webpack.Configuration => ({
          target: "node",
          mode: "production",
          entry: `data:text/typescript;base64,${Buffer.from(
            `
            import 'source-map-support/register.js';
            import route from "./${path.relative(ROOT_DIR, data.path)}";
            exports.handler = (evt, ctx) => route.handler(evt, ctx);`
          ).toString("base64")}`,
          resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
          },
          module: {
            rules: [
              {
                test: /\.[jt]sx?$/,
                exclude: [/node_modules/],
                use: {
                  loader: "ts-loader",
                  options: {
                    configFile: path.join(ROOT_DIR, "tsconfig.json"),
                    projectReferences: true,
                    onlyCompileBundledFiles: true,
                    getCustomTransformers: () => ({}),
                  },
                },
              },
            ],
          },
          output: {
            filename: "index.js",
            path: path.join(DIST_DIR, data.route.opts.key),
          },
          devtool: "source-map",
        })
      )
    );
    compiler.run((err, stats) => {
      if (!stats) return;
      if (err) {
        console.error(err);
        return;
      }
      console.log(stats.toString({ colors: true }));
    });
    compiler.hooks.done.tap("endCall", (stats) => {
      for (const [i, routeStats] of stats.stats.entries())
        if (!routeStats.hasErrors())
          uncompiledRoutes.delete(uncompiledRouteList[i]);
      stats.hasErrors()
        ? reject(new Error("Webpack compilation failed"))
        : resolve();
    });
  });

const getLambdaAssetArchive = async (
  data: LambdaData
): Promise<pulumi.asset.AssetArchive> => {
  if (data.assetArchive) return data.assetArchive;

  uncompiledRoutes.add(data);
  const uncompiledRouteList = [...uncompiledRoutes];
  await compileRoutes();
  for (const d of uncompiledRouteList) {
    uncompiledRoutes.delete(d);
    d.assetArchive = new pulumi.asset.AssetArchive({
      ".": new pulumi.asset.FileArchive(path.join(DIST_DIR, d.route.opts.key)),
    });
  }
  return data.assetArchive!;
};

export const createLambdas = (
  table: aws.dynamodb.Table,
  routeModules: { default: Route<Json, Json> }[]
): LambdaData[] => {
  const routeModulesSet = new Set(routeModules);
  return Object.values(require.cache)
    .filter(
      (
        mod
      ): mod is Omit<NodeModule, "exports"> & {
        exports: { default: Route<Json, Json> };
      } => routeModulesSet.has(mod?.exports)
    )
    .map((mod) => {
      const route = mod.exports.default;
      const existingData = routeLambdas.get(route);
      if (existingData) return existingData;

      const lambda = new aws.lambda.Function(`${route.opts.key}-handler`, {
        memorySize: 128,
        timeout: 5,
        runtime: aws.lambda.Runtime.NodeJS14dX,
        handler: "index.handler",
        role: getDefaultLambdaRole(table).arn,
        code: pulumi
          .output(undefined)
          .apply(async () => getLambdaAssetArchive(data)),
      });
      const data: LambdaData = { path: mod.filename, route, lambda };
      uncompiledRoutes.add(data);
      routeLambdas.set(route, data);
      return data;
    });
};

export const getPulumiRoute = (
  route: Route<Json, Json>,
  lambda: aws.lambda.Function
): awsx.apigateway.Route => {
  return {
    path: `/v1/${route.opts.key}`,
    method: "POST",
    eventHandler: lambda,
  };
};
