import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import "aws-lambda";
import * as t from "runtypes";

export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

export type Opaque<T, Key extends string> = T & { __type: Key };

export class ClientError extends Error {}

/** Creates a backend route with sensible defaults:
 * - 128mb memory
 * - 5 second timeout
 * - Node 14 */
export const createRoute = <Input extends Json, Output extends Json>(opts: {
  /** Used to generate some options:
   * - URL path = `/{KEY}`
   * - Lambda ID = `{KEY}-handler` */
  key: string;
  route?: Omit<awsx.apigateway.Route, "eventHandler">;
  lambda?: Omit<
    aws.lambda.CallbackFunctionArgs<
      awsx.apigateway.Request,
      awsx.apigateway.Response
    >,
    "callback"
  >;
  input: t.Runtype<Input>;
  callback: (
    input: Input,
    event: awsx.apigateway.Request,
    context: aws.lambda.Context
  ) => Promise<Output>;
}): awsx.apigateway.Route => ({
  path: `/${opts.key}`,
  method: "POST",
  ...opts.route,
  eventHandler: new aws.lambda.CallbackFunction<
    awsx.apigateway.Request,
    awsx.apigateway.Response
  >(`${opts.key}-handler`, {
    memorySize: 128,
    timeout: 5,
    runtime: aws.lambda.Runtime.NodeJS14dX,
    ...opts.lambda,
    callback: async (evt, ctx) => {
      try {
        if (!evt.body) throw new Error("No body provided");
        const input = opts.input.check(JSON.parse(evt.body));
        try {
          return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(await opts.callback(input, evt, ctx)),
          };
        } catch (err) {
          if (err instanceof ClientError) throw err;
          console.error("server error", { route: opts.key, err });
          return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Internal server error" }),
          };
        }
      } catch (err) {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: String(err) }),
        };
      }
    },
  }),
});
