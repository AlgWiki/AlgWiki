import { O2ApiAny, RequestContext } from "@oxy2/backend";
import type { APIGatewayProxyHandler } from "aws-lambda";

export const createLambdaHandler =
  (api: O2ApiAny): APIGatewayProxyHandler =>
  async (evt) => {
    const endpointPath = evt.path.split("/").slice(1);
    const ctx: RequestContext<any> = {
      input: JSON.parse(evt.body),
      req: {},
    };
    await api.execute(endpointPath, ctx);
    return {
      statusCode: ctx.req.res.status,
      body: ctx.req.res.body,
    };
  };
