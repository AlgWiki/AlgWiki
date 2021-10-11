import { IncomingMessage } from "http";

import chalk from "chalk";
import Koa from "koa";

import { Route, routes } from "../src";

const readBody = (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (data) => (body += data));
    req.on("end", () => resolve(body));
    req.on("error", (err) => reject(err));
  });

const main = async (): Promise<void> => {
  process.env.NODE_ENV = "development";
  const port = Number(process.env.PORT || 4565);
  const routesByKey = new Map<string, Route<any, any>>();
  for (const route of Object.values(routes))
    routesByKey.set(route.opts.key, route);
  const app = new Koa();
  app.use(async (ctx, next) => {
    try {
      console.log(chalk.gray(`${ctx.method} ${ctx.path}`));
      const pathKey = /^\/v1\/([^/?#]+)/.exec(ctx.path)?.[1];
      const route = routesByKey.get(pathKey!);
      if (!route || ctx.method !== "POST") {
        ctx.status = 404;
      } else {
        const result = await route.handler({
          body: await readBody(ctx.req),
        } as any);
        ctx.status = result.statusCode;
        ctx.body = result.body;
        if (result.headers)
          ctx.set(
            Object.fromEntries(
              Object.entries(result.headers).map(([name, value]) => [
                name,
                String(value),
              ])
            )
          );
        await next();
      }
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
    console.log(
      ctx.status < 400
        ? chalk.bgGreen(ctx.status)
        : ctx.status < 500
        ? chalk.bgBlue(ctx.status)
        : chalk.bgRed(ctx.status)
    );
  });
  app.listen(port);
  console.log(`Dev server listening at: http://localhost:${port}`);
};

if (require.main === module)
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
