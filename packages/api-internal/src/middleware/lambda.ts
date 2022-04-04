import type { O2Middleware } from "@oxy2/backend";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import type { HttpReq } from "../util/types";

export const lambda: O2Middleware<HttpReq> = async (evt, next) => {
  await next();
};
