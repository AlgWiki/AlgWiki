import http, { STATUS_CODES } from "http";
import { Socket } from "net";

import {
  O2Api,
  O2ApiAny,
  O2ClientError,
  O2ClientErrorAny,
  O2Endpoint,
  O2EndpointInput,
} from "@oxy2/backend";
import bodyParser from "co-body";
import Koa, { Context } from "koa";
import onFinished, { isFinished } from "on-finished";
import * as prettier from "prettier";

type UnknownError =
  | O2ClientErrorAny
  | Record<string, unknown>
  | undefined
  | null;

interface O2Socket extends Socket {
  server: http.Server;
  clientError?: { err: unknown; status: number };
}

export interface DevServerOpts {
  api: O2ApiAny;
  port?: number;
}

export const startDevServer = ({
  api,
  port = 8080,
}: DevServerOpts): Promise<http.Server> =>
  new Promise((resolve, reject) => {
    const errorHandler = (err?: UnknownError, ctx?: Context): void => {
      if (ctx) {
        const socket = ctx.req?.socket as O2Socket;
        // Swallow any server errors if they were probably caused by the client making an invalid request
        if (socket?.clientError) {
          const clientError = socket.clientError.err as
            | { code?: string }
            | undefined;

          ctx.status = socket.clientError.status;
          ctx.body = { error: "invalid request", code: clientError?.code };

          console.info("Client socket error", {
            v8Code: clientError?.code,
            err: clientError,
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
              "unknown error",
        { ...logData, errorOnlyShownInDev: err }
      );
    };
    const onError = (err: Error): void => reject(err);
    const server = http
      .createServer(
        new Koa()
          .use(async (ctx, next) => {
            try {
              await next();
            } catch (err) {
              errorHandler(err, ctx);
            }

            try {
              ctx.response.type = "json";
              /** @magic JSON responses are prettified during local dev */
              ctx.body = prettier.format(JSON.stringify(ctx.body ?? {}), {
                parser: "json",
              });
            } catch (err) {
              ctx.status = 500;
              console.error("Failed to stringify output", {
                errOnlyShownInDev: err,
              });
              ctx.body = JSON.stringify({
                error: "failed to stringify output",
              });
            }
          })
          .use(async (ctx, next) => {
            let endpointLatency: number | undefined;
            onFinished(ctx.res, () => {
              console.log("Request", {
                req: {
                  method: ctx.req.method,
                  url: ctx.req.url,
                  // TODO: See if we can sanitize these to make sure they're safe to log
                  // headers: ctx.headers,
                  // query: ctx.query,
                  // host: ctx.host,
                  remote: {
                    addr: ctx.req.socket.remoteAddress,
                    port: ctx.req.socket.remotePort,
                  },
                },
                res: {
                  status: ctx.res.statusCode,
                  latency: endpointLatency,
                  // length: ctx.res.length,
                  // TODO: See if we can sanitize these to make sure they're safe to log
                  // headers: ctx.res.getHeaders(),
                },
              });

              // Put an empty line after requests in dev to easily distinguish request log boundaries
              process.stdout.write("\n");
            });

            if (ctx.req.method !== "POST")
              throw new O2ClientError("method must be POST for O2 endpoints", {
                status: 405,
                logData: { method: ctx.req.method },
              });

            let body: unknown;
            try {
              body = (await bodyParser(ctx.req)) as unknown;
            } catch (err) {
              const status = (err as Record<string, unknown> | undefined)
                ?.status;
              throw new O2ClientError("could not read request body", {
                status: typeof status === "number" ? status : undefined,
                responseData: { details: String(err) },
              });
            }

            const pathParts = ctx.req.url!.split("/").filter((part) => part);
            if (pathParts.length === 0)
              throw new O2ClientError("no endpoint specified in path");
            const endpointName = pathParts[pathParts.length - 1];
            const apiPath = pathParts.slice(0, -1);
            const endpoint = pathParts.reduce(
              (apiOrEndpoint, name) =>
                apiOrEndpoint instanceof O2Api
                  ? apiOrEndpoint.endpoints[name]
                  : undefined,
              api
            );

            if (!endpoint || !(endpoint instanceof O2Endpoint))
              throw new O2ClientError("endpoint not found", {
                status: 404,
                responseData: { apiPath, endpoint: endpointName },
                logData: { apiPath, endpoint: endpointName },
              });

            const startTime = Date.now();
            try {
              ctx.body = await endpoint.execute(body as O2EndpointInput);
            } finally {
              endpointLatency = Date.now() - startTime;
            }

            await next();

            if (isFinished(ctx.res)) throw new O2ClientError("socket closed");
          })
          .on("error", errorHandler)
          .callback()
      )
      .on("clientError", (err: Error & { code?: string }, socket: O2Socket) => {
        const status = err.code === "HPE_HEADER_OVERFLOW" ? 431 : 400;
        socket.clientError = { err, status };

        // Logic from Node source since it does not execute if there is a listener
        // https://github.com/nodejs/node/blob/master/lib/_http_server.js#L611
        if (socket.writable) {
          socket.write(
            `HTTP/1.1 ${status} ${STATUS_CODES[status]}\r\nConnection: close\r\n\r\n`
          );
        }
        socket.destroy(err);
      })
      .once("error", onError)
      .on("listening", () => {
        server.off("error", onError);
        console.log("dev server started", {
          url: `http://localhost:${port}`,
        });
        resolve(server);
      })
      .listen(port);
  });
