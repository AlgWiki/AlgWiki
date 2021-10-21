import { SpawnSyncReturns, spawnSync } from "child_process";
import path from "path";

import fg from "fast-glob";
import * as fse from "fs-extra";

import { getPulumiPassphrase } from "../src/util/stack";

const main = async (): Promise<void> => {
  const pulumiPassphrase = await getPulumiPassphrase();
  const pulumi = (args: string[]): SpawnSyncReturns<Buffer> =>
    spawnSync("pulumi", args, {
      stdio: "inherit",
      env: { ...process.env, PULUMI_CONFIG_PASSPHRASE: pulumiPassphrase },
    });

  const stackFiles = await fg(
    path.join(__dirname, "..", ".pulumi", "*", "local*")
  );
  await Promise.all(stackFiles.map((filePath) => fse.remove(filePath)));

  pulumi(["stack", "init", "local"]);
  pulumi(["config", "set", "aws:region", "us-east-1"]);
  pulumi(["config", "set", "aws:accessKey", "test"]);
  pulumi(["config", "set", "aws:secretKey", "test"]);
  pulumi(["config", "set", "aws:s3ForcePathStyle", "true"]);
  pulumi(["config", "set", "aws:skipCredentialsValidation", "true"]);
  pulumi(["config", "set", "aws:skipRequestingAccountId", "true"]);
  for (const service of ["iam", "apigateway", "lambda", "dynamodb"])
    pulumi([
      "config",
      "set",
      "--path",
      `aws:endpoints[0].${service}`,
      "http://localhost:4566",
    ]);
};

if (require.main === module)
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
