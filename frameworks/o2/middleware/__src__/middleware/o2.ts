/* eslint-disable */
import { O2Api, O2ApiAny } from "../O2Api";
import { O2Endpoint, O2EndpointAny, O2EndpointInput } from "../O2Endpoint";
import { O2ClientError } from "../errors";
import type { O2Middleware } from "../util/middleware";
import { AppContextBody } from "./body";

export interface AppContextO2Endpoint {
  endpointName: string;
  endpoint: O2EndpointAny;
  apiPath: string[];
}

export interface AppContextO2EndpointExecute {
  endpointError?: unknown;
  endpointLatency: number;
}

/** Returns the requested endpoint. */
export const middlewareGetO2Endpoint = (opts: {
  api: O2ApiAny;
}): O2Middleware<
  Record<string, never>,
  "req",
  never,
  AppContextO2Endpoint
> => async (ctx, next) => {
  if (ctx.req.method !== "POST") {
    throw new O2ClientError("method must be POST for O2 endpoints", {
      logData: { method: ctx.req.method },
    });
  }

  const pathParts = ctx.req.url.split("/").filter((part) => part);
  if (pathParts.length === 0) {
    throw new O2ClientError("no endpoint specified in path");
  }
  const endpointName = pathParts[pathParts.length - 1];
  const apiPath = pathParts.slice(0, -1);
  const endpoint = pathParts.reduce(
    (apiOrEndpoint, name) =>
      apiOrEndpoint instanceof O2Api
        ? apiOrEndpoint.endpoints[name]
        : undefined,
    opts.api
  );

  if (!endpoint || !(endpoint instanceof O2Endpoint)) {
    throw new O2ClientError("endpoint not found", {
      responseData: { apiPath, endpoint: endpointName },
      logData: { apiPath, endpoint: endpointName },
    });
  }

  // TODO: What should I do about API versioning?
  // const endpointVersions = api.endpoints[endpointName];
  // if (!endpointVersions) {
  //   throw new O2ClientError("endpoint not found", {
  //     responseData: { endpoint: endpointName },
  //     logData: { endpoint: endpointName },
  //   });
  // }

  // const versionRaw = pathParts[2];
  // const version = versionRaw ? parseInt(versionRaw) : 0;
  // if (!(version >= 0)) {
  //   throw new O2ClientError("invalid endpoint version", {
  //     responseData: { version: versionRaw },
  //     logData: { version: versionRaw },
  //   });
  // }

  // const endpoint = endpointVersions[version];
  // if (!endpoint) {
  //   throw new O2ClientError("version does not exist for endpoint", {
  //     responseData: { version },
  //     logData: { endpoint: endpointName, version },
  //   });
  // }

  ctx.endpointName = endpointName;
  ctx.endpoint = endpoint;
  ctx.apiPath = apiPath;
  await next();
};

/** Executes the requested endpoint. */
export const middlewareExecuteO2Endpoint = (): O2Middleware<
  AppContextO2Endpoint & AppContextBody,
  "endpoint" | "request",
  "body",
  AppContextO2EndpointExecute
> => async (ctx, next) => {
  const startTime = Date.now();
  try {
    ctx.body = await ctx.endpoint.execute(ctx.request.body as O2EndpointInput);
  } catch (err) {
    ctx.endpointError = err;
  } finally {
    ctx.endpointLatency = Date.now() - startTime;
  }

  await next();
};
