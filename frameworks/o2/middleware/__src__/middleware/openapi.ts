/* eslint-disable */
import querystring from "querystring";
import { URL } from "url";

import ChowChow, {
  RequestValidationError,
  ResponseValidationError,
} from "oas3-chow-chow";

import { declareMagic } from "@oxy2/magic";

import { O2ApiAny } from "../O2Api";
import { O2ClientError } from "../errors";
import type { O2Middleware } from "../util/middleware";
import type { AppContextBody } from "./body";
import { AppContextLogger } from "./logger";
import { middlewareNoop } from "./noop";

export const parseUrl = (url: string): URL => new URL(url, "http://null.com");

/** Adds a route which returns the service's OpenAPI definition as JSON. */
export const middlewareOpenapiRouteJson = ({
  api,
  method = "GET",
  path = "/openapi.json",
}: {
  api: O2ApiAny;
  method?: string;
  path?: string;
}): O2Middleware<{}, "req" | "url", "status" | "body"> => {
  const methodUpper = method.toUpperCase();
  return async (ctx, next) => {
    const parsedUrl = parseUrl(ctx.url);
    if (ctx.req.method === methodUpper && parsedUrl.pathname === path) {
      ctx.status = 200;
      ctx.body = api.openapi;
      return;
    }

    await next();
  };
};

export const middlewareOpenapiValidateRequest = ({
  api,
}: {
  api: O2ApiAny;
}): O2Middleware<AppContextBody, "req" | "url" | "request"> => {
  const chow = new ChowChow(api.openapi);

  return async (ctx, next) => {
    const parsedUrl = parseUrl(ctx.url);
    try {
      chow.validateRequestByPath(parsedUrl.pathname, ctx.req.method, {
        path: {},
        query: querystring.parse(parsedUrl.search.substring(1)),
        header: ctx.req.headers,
        body: ctx.request.body,
      });
    } catch (err) {
      if (err instanceof RequestValidationError) {
        const errors = err.meta.rawErrors
          ? err.meta.rawErrors.map(
              (err) => ((err as unknown) as { error: string }).error
            )
          : [err.message];
        throw new O2ClientError("Incorrect request input", {
          responseData: { in: err.meta.in, errors },
          logData: { in: err.meta.in },
        });
      }
      throw err;
    }

    await next();
  };
};

/** Add before the error handler in the middleware chain, before any middleware which alter the response. */
export const middlewareOpenapiValidateResponse = ({
  api,
}: {
  api: O2ApiAny;
}): O2Middleware<
  AppContextLogger,
  "req" | "res" | "url" | "body" | "logger"
> => {
  if (skipInProd) {
    declareMagic({
      description:
        "Endpoint responses are validated only during local dev to ensure they match the OpenAPI doc",
    });
    if (!isDev) return middlewareNoop;
  }

  const chow = new ChowChow(api.openapi);

  return async (ctx, next) => {
    await next();

    const parsedUrl = parseUrl(ctx.url);
    try {
      chow.validateResponseByPath(parsedUrl.pathname, ctx.req.method, {
        status: ctx.res.statusCode,
        header: ctx.res.getHeaders(),
        body: ctx.body,
      });
    } catch (err) {
      if (err instanceof ResponseValidationError) {
        const errors = err.meta.rawErrors
          ? err.meta.rawErrors.map(
              (err) => ((err as unknown) as { error: string }).error
            )
          : [err.message];
        console.error("Incorrect server response", {
          in: err.meta.in,
          // Errors could contain sensitive data so only show them during development
          ...(isDev ? { errors } : {}),
        });
      }
    }
  };
};
