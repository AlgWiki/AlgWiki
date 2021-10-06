import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

export type Opaque<T, Key extends string> = T & { __type: Key };

export type MaybePromise<T> = T | Promise<T>;

export class ClientError extends Error {}
export class ServerError extends Error {}

type RouteCallback<Input extends Json, Output extends Json> = MaybePromise<
  (
    this: Route<Input, Output>,
    input: Input,
    event: awsx.apigateway.Request,
    context: aws.lambda.Context
  ) => Promise<Output>
>;

export interface RouteOpts<Input extends Json, Output extends Json> {
  /** Used to generate some options:
   * - URL path = `/{KEY}`
   * - Lambda ID = `{KEY}-handler` */
  key: string;
  route?: Omit<awsx.apigateway.Route, "eventHandler">;
  lambda?: Omit<aws.lambda.FunctionArgs, "code">;
  callback: () => RouteCallback<Input, Output>;
}

/** Creates a backend route with sensible defaults:
 * - 128mb memory
 * - 5 second timeout
 * - Node 14 */
export class Route<Input extends Json, Output extends Json> {
  callback?: RouteCallback<Input, Output>;
  constructor(public opts: RouteOpts<Input, Output>) {}

  async handler(
    evt: awsx.apigateway.Request,
    ctx: aws.lambda.Context
  ): Promise<awsx.apigateway.Response> {
    try {
      if (!evt.body) throw new Error("No body provided");
      const input = JSON.parse(evt.body) as Input;
      try {
        if (!this.callback) this.callback = this.opts.callback();
        const callback = await this.callback;
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(await callback.call(this, input, evt, ctx)),
        };
      } catch (err) {
        if (err instanceof ClientError) throw err;
        console.error("server error", { route: this.opts.key, err });
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error:
              err instanceof ServerError
                ? err.message
                : "Internal server error",
          }),
        };
      }
    } catch (err) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: err instanceof Error ? err.message : "Unknown error",
        }),
      };
    }
  }
}
