import { table } from "@alg-wiki/db";
import * as aws from "@pulumi/aws";

export const dynamodb = new aws.dynamodb.Table(table.name, {
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
