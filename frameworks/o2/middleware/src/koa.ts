import * as http from "http";

import { O2Middleware } from "@oxy2/backend";
import { Context } from "koa";

import { ContextJson, ContextOutput } from "./body";

export interface ContextHttp {
  httpReq: http.IncomingMessage;
  httpRes: http.ServerResponse;
}

export interface ContextKoa {
  koa: Context;
}

export const koaMiddleware =
  (): O2Middleware<ContextKoa & ContextOutput & ContextJson, ContextHttp> =>
  async (ctx, next) => {
    try {
      ctx.httpReq = ctx.koa.req;
      ctx.httpRes = ctx.koa.res;
      await next();
    } finally {
      // Logic derived from koa-is-json package: https://github.com/koajs/is-json/blob/master/index.js
      const isBodyNotJson =
        Buffer.isBuffer(ctx.output) ||
        typeof (ctx.output as { pipe?: () => void })?.pipe === "function";
      if (isBodyNotJson) {
        // TODO
        ctx.koa.status = 500;
      } else {
        if (!ctx.koa.response) ctx.koa.response = {} as Context["response"];
        ctx.koa.response.type = "json";
        ctx.koa.body = ctx.jsonOutput;
      }
    }
  };
