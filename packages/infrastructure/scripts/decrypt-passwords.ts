import { spawnSync } from "child_process";
import path from "path";

import * as openpgp from "openpgp";

interface SsmParameter {
  Parameter: { Value: string };
}

type PulumiResourceState =
  | {
      type: "aws:iam/userLoginProfile:UserLoginProfile";
      outputs: { user: string; encryptedPassword?: string };
    }
  | {
      type: "aws:iam/accessKey:AccessKey";
      outputs: {
        user: string;
        id: string;
        encryptedSecret?: string;
        secret?: { plaintext?: string };
      };
    }
  | {
      type: "aws:iam/user:User";
      outputs: { name: string; arn: string };
    };

const readSecretParameter = (paramName: string): string => {
  const param = JSON.parse(
    spawnSync(
      "aws",
      ["ssm", "get-parameter", "--with-decryption", "--name", paramName],
      { stdio: ["inherit", "pipe"] }
    ).stdout.toString()
  ) as SsmParameter;
  return param.Parameter.Value;
};

const readStateWithSecrets = () => {
  const state = JSON.parse(
    spawnSync(
      "pulumi",
      ["stack", "export", "--stack", "AlgWiki/prod", "--show-secrets"],
      {
        cwd: path.join(__dirname, ".."),
        stdio: ["inherit", "pipe"],
      }
    ).stdout.toString()
  ) as { deployment: { resources: PulumiResourceState[] } };
  return state.deployment.resources;
};

const main = async () => {
  const privateKey = await openpgp.readPrivateKey({
    binaryKey: Buffer.from(readSecretParameter("pgp-private-key"), "base64"),
  });
  const pgpDecrypt = async (messageBase64: string): Promise<string> => {
    const { data } = await openpgp.decrypt({
      decryptionKeys: [privateKey],
      message: await openpgp.readMessage({
        binaryMessage: Buffer.from(messageBase64, "base64"),
      }),
    });
    return data.toString();
  };

  const resources = readStateWithSecrets();
  const usersByName = new Map(
    resources.flatMap((resource) =>
      resource.type === "aws:iam/user:User"
        ? [[resource.outputs.name, resource]]
        : []
    )
  );

  for (const resource of resources) {
    if (
      resource.type !== "aws:iam/userLoginProfile:UserLoginProfile" ||
      !resource.outputs.encryptedPassword
    )
      continue;

    console.log({
      accountId: usersByName
        .get(resource.outputs.user)
        ?.outputs.arn.split(":")[4],
      username: resource.outputs.user,
      tempPassword: await pgpDecrypt(resource.outputs.encryptedPassword),
    });
  }

  for (const resource of resources) {
    if (resource.type !== "aws:iam/accessKey:AccessKey") continue;

    console.log({
      accountId: usersByName
        .get(resource.outputs.user)
        ?.outputs.arn.split(":")[4],
      username: resource.outputs.user,
      accessKeyId: resource.outputs.id,
      secretAccessKey:
        resource.outputs.secret && resource.outputs.secret.plaintext
          ? (JSON.parse(resource.outputs.secret.plaintext) as string)
          : resource.outputs.encryptedSecret
          ? await pgpDecrypt(resource.outputs.encryptedSecret)
          : undefined,
    });
  }
};

if (require.main === module)
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
