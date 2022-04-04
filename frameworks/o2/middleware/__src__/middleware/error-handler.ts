/* eslint-disable @typescript-eslint/no-unsafe-call */
import { STATUS_CODES } from "http";

import { O2ClientError, O2ClientErrorAny } from "@oxy2/backend";
import { isFinished } from "on-finished";

type UnknownError =
  | O2ClientErrorAny
  | Record<string, unknown>
  | undefined
  | null;

export interface ErrorHandlerMiddlewareOpts {
  logErrorsInDev?: boolean;
}

/** Logs error messages and returns correct response.
 *
 * Usage: `koaApp.on('error', koaErrorHandler(isDev));` */
export const koaErrorHandler =
  ({ logErrorsInDev = false }: ErrorHandlerMiddlewareOpts): ErrorHandler =>
  (err, ctx) => {
    if (ctx) {
      // Swallow any server errors if they were probably caused by the client making an invalid request
      if (ctx.req?.socket.clientError) {
        ctx.status = ctx.req.socket.clientError.status;
        ctx.body = { error: "Invalid request" };

        const clientError = ctx.req.socket.clientError.err as
          | { code?: string }
          | undefined;
        console.info("Client socket error", {
          v8Code: clientError?.code || undefined,
          err: logErrorsInDev ? clientError : undefined,
        });
        return;
      }

      const errStatus = typeof err?.status === "number" && err.status;
      ctx.status = errStatus || (err instanceof O2ClientError ? 400 : 500);
      const message =
        (err instanceof O2ClientError && err.message) ||
        STATUS_CODES[ctx.status];
      ctx.body = { error: message, ...(err?.responseData as {}) };
    }

    const logData = typeof err?.logData === "object" && err.logData;
    console[err instanceof O2ClientError ? "warn" : "error"](
      err instanceof O2ClientError
        ? err.message
        : (err && err instanceof Error && err.constructor.name) ||
            "Unknown error",
      ...(logData || logErrorsInDev
        ? [{ ...logData, ...(logErrorsInDev && { errorOnlyShownInDev: err }) }]
        : [])
    );
  };

/** Logs and generates responses to errors appropriately.
 *
 * Will throw on the way back down the middleware chain if the response socket is closed. */
export const middlewareErrorHandler = (
  opts: ErrorHandlerMiddlewareOpts
): ErrorHandlerMiddleware => {
  const errorHandler = koaErrorHandler(opts);

  return async (ctx, next) => {
    try {
      await next();
      if (ctx.endpointError)
        errorHandler(ctx.endpointError as UnknownError, ctx);
    } catch (err) {
      errorHandler(err, ctx);
    }

    // Skip rest of middleware (eg. response logger) if the socket has already closed
    if (isFinished(ctx.res)) throw new O2ClientError("socket closed");
  };
};
