import { CORS_ALLOWED_DOMAINS } from "@algwiki/common";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as cookie from "cookie";

import { Json, MaybePromise } from "./types";

export class ClientError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}
export class ServerError extends Error {
  constructor(message: string, public status = 500) {
    super(message);
  }
}

export type RouteCookies = Record<
  string,
  (cookie.CookieSerializeOptions & { value: string }) | undefined
>;

type RouteCallback<Input extends Json, Output> = MaybePromise<
  (
    this: Route<Input, Output>,
    input: Input,
    evt: APIGatewayProxyEvent
  ) => Promise<
    Output & {
      _http?: {
        headers?: Record<string, string | string[]>;
        cookies?: RouteCookies;
      };
    }
  >
>;

export interface RouteOpts<Input extends Json, Output> {
  /** Used to generate some options:
   * - URL path = `/{KEY}`
   * - Lambda ID = `{KEY}-handler` */
  key: string;
  callback: () => RouteCallback<Input, Output>;
}

/** Creates a backend route with sensible defaults:
 * - 128mb memory
 * - 5 second timeout
 * - Node 14 */
export class Route<Input extends Json, Output> {
  callback?: RouteCallback<Input, Output>;
  constructor(public opts: RouteOpts<Input, Output>) {}

  async handler(evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      if (!evt.headers.origin) {
        console.warn("Missing Origin header", {
          userAgent: evt.headers["user-agent"],
        });
        throw new ClientError("Missing Origin header");
      }
      if (!CORS_ALLOWED_DOMAINS.includes(evt.headers.origin))
        throw new ClientError("Origin not allowed to access API");

      if (!evt.body) throw new ClientError("No body provided");
      const input = JSON.parse(evt.body) as Input;
      try {
        if (!this.callback) this.callback = this.opts.callback();
        const callback = await this.callback;
        const { _http, ...body } = await callback.call(this, input, evt);
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            ...(_http?.headers &&
              Object.fromEntries(
                Object.entries(_http.headers).filter(
                  ([, value]) => !Array.isArray(value)
                )
              )),
          },
          multiValueHeaders: {
            ...(_http?.headers &&
              Object.fromEntries(
                Object.entries(_http.headers).filter(([, value]) =>
                  Array.isArray(value)
                )
              )),
            ...(_http?.cookies && {
              Cookie: Object.entries(_http.cookies).map(([name, opts]) => {
                if (!opts)
                  return cookie.serialize(name, "", {
                    expires: new Date(1000),
                  });
                const { value, ...otherOpts } = opts;
                return cookie.serialize(name, value, otherOpts);
              }),
            }),
          },
          body: JSON.stringify(body),
        };
      } catch (err) {
        if (err instanceof ClientError) throw err;
        console.error("Server error", { route: this.opts.key, err });
        return {
          statusCode: (err as { status?: number })?.status || 500,
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
        statusCode: (err as { status?: number })?.status || 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: err instanceof Error ? err.message : "Unknown error",
        }),
      };
    }
  }
}
