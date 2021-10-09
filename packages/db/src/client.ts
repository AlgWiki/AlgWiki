import fs from "fs";
import os from "os";
import path from "path";

import { DynamoDB } from "aws-sdk";
import { CredentialsOptions } from "aws-sdk/lib/credentials";

export const createDbClient = (): DynamoDB.DocumentClient =>
  new DynamoDB.DocumentClient({
    region: "us-east-1",
    // TODO: Move these things outside of the prod bundle
    ...(process.env.NODE_ENV === "development"
      ? {
          endpoint: "http://localhost:4566",
          credentials: {
            accessKeyId: "test",
            secretAccessKey: "test",
          },
        }
      : {}),
    ...(process.env.USE_AWS_PROFILE_CREDENTIALS &&
      (() => {
        const credentialsContents = fs.readFileSync(
          path.join(os.homedir(), ".aws", "credentials"),
          "utf8"
        );
        const entries = credentialsContents.split(/^\[([^\]]+)\]$/m);
        const idx = entries.indexOf(process.env.USE_AWS_PROFILE_CREDENTIALS);
        if (idx === -1)
          throw new Error(
            `Could not find aws profile: ${process.env.USE_AWS_PROFILE_CREDENTIALS}`
          );
        const credentials = Object.fromEntries(
          entries[idx + 1].split("\n").flatMap((line) => {
            const match = /^\s*(\w+)\s*=\s*(.+?)\s*$/.exec(line);
            if (!match) return [];
            const key = {
              aws_access_key_id: "accessKeyId",
              aws_secret_access_key: "secretAccessKey",
            }[match[1]];
            if (!key) return [];
            return [[key, match[2]]];
          })
        ) as unknown as CredentialsOptions;
        return {
          endpoint: "https://dynamodb.us-east-1.amazonaws.com",
          credentials,
        };
      })()),
  });
