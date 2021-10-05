import { DynamoDB } from "aws-sdk";

export const createDbClient = (): DynamoDB.DocumentClient =>
  new DynamoDB.DocumentClient({
    region: "us-east-1",
  });
