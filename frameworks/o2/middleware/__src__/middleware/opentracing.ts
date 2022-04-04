/* eslint-disable */
import { Span, Tracer } from "opentracing";

import { declareMagic } from "@oxy2/magic";

import { O2Middleware } from "../util/middleware";
import type { AppContextLogger } from "./logger";
import { middlewareNoop } from "./noop";

export interface AppContextTracer {
  span: Span;
  // traceData: {
  //   traceId: string;
  //   spanId?: string;
  //   parentSpanId?: string;
  // };
}

export interface AppContextOpentracing extends AppContextTracer {
  tracer: Tracer;
}

/** Adds Opentracing data and utilities to context.
 * Note that this implementation does not record traces to a backend. */
export const middlewareOpentracing = (): O2Middleware<
  {},
  "req",
  never,
  AppContextOpentracing
> => {
  if (opts.traceInDev) {
    declareMagic({
      description:
        "Traces are recorded to console during local dev instead of an endpoint",
    });
  } else {
    declareMagic({
      description: "No tracing during local dev",
    });
    if (opts.isDev) {
      return middlewareNoop;
    }
  }

  const tracer = new Tracer();

  return async (ctx, next) => {
    ctx.tracer = tracer;
    // TODO: What should name be and how do we get parent from headers?
    ctx.span = tracer.startSpan("http-request", { childOf: undefined });

    await next();
  };
};

/** Adds tracing data to all logs created as part of this request.
 *
 * Should appear very early in the middleware chain before any logs are made. */
export const middlewareTracerAddToLogs = ({
  traceLogKey = "tr",
  isDev,
  skipInDev = true,
}: {
  traceLogKey?: string;
  isDev: boolean;
  skipInDev?: boolean;
}): O2Middleware<
  AppContextLogger & AppContextTracer,
  "addToLoggerContext" | "traceData"
> => {
  if (skipInDev) {
    declareMagic({
      description:
        "Trace data is added to logs in prod but not during local dev",
    });
    if (isDev) return middlewareNoop;
  }

  return async (ctx, next) => {
    ctx.addToLoggerContext({ [traceLogKey]: ctx.traceData });

    await next();
  };
};
