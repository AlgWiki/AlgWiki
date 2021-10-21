import path from "path";

import * as fse from "fs-extra";

import { ALPHA } from "../../../common";
import { randStr } from "../../../common-node";

const PULUMI_PASSPHRASE_PATH = path.join(
  __dirname,
  "..",
  "..",
  ".pulumi-passphrase"
);

export const getPulumiPassphrase = async (): Promise<string> => {
  try {
    const contents = await fse.readFile(PULUMI_PASSPHRASE_PATH, "utf8");
    return contents.trim();
  } catch (err) {
    if ((err as { code?: string } | undefined)?.code !== "ENOENT") throw err;
    const randomPassphrase = randStr(32, ALPHA);
    await fse.writeFile(PULUMI_PASSPHRASE_PATH, randomPassphrase);
    return randomPassphrase;
  }
};
