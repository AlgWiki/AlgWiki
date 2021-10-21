import * as aws from "@pulumi/aws";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Pulumi requires relative imports (symlinks in node_modules kill it)
import { table } from "../../db/src";

export const createTable = () =>
  new aws.dynamodb.Table(table.name, {
    name: table.name,
    billingMode: "PAY_PER_REQUEST",
    hashKey: table.index.hashKey,
    rangeKey: table.index.rangeKey,
    attributes: Object.entries(table.attributes).map(([name, type]) => ({
      name,
      type,
    })),
    globalSecondaryIndexes:
      table.globalSecondaryIndexes &&
      Object.entries(table.globalSecondaryIndexes).map(([name, gsi]) => ({
        ...gsi,
        name,
      })),
  });
