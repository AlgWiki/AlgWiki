import * as http from "http";

import { O2ClientError, O2Middleware } from "@oxy2/backend";
import { declareMagic } from "@oxy2/magic";
import bodyParser from "co-body";
import prettier from "prettier";

export interface ContextRawInput {
  rawInput?: unknown;
}

export interface ContextOutput {
  output: unknown;
}

export interface ContextJson {
  jsonOutput?: string;
}

const ERROR_JSON = JSON.stringify({ error: "Unknown error" });

/** Reads raw input from HTTP request. */
export const httpParseBody =
  (
    opts?: bodyParser.Options
  ): O2Middleware<{ httpReq: http.IncomingMessage }, ContextRawInput> =>
  async (ctx, next) => {
    try {
      ctx.rawInput = await bodyParser(ctx.httpReq, opts);
    } catch (err) {
      throw new O2ClientError("Invalid request body", {
        status: (err as { status?: number })?.status,
        responseData: { details: String(err) },
      });
    }

    await next();
  };

/** Makes all responses JSON by default. */
export const httpOutputJson = ({
  isDev,
  prettifyInDev = true,
}: {
  isDev: boolean;
  prettifyInDev?: boolean;
}): O2Middleware<ContextOutput & ContextJson> => {
  if (prettifyInDev) {
    declareMagic({
      description: "JSON responses are prettified during local dev",
    });
  }
  const prettify = prettifyInDev && isDev;

  return async (ctx, next) => {
    await next();

    try {
      ctx.jsonOutput = JSON.stringify(ctx.output);

      if (prettify) {
        ctx.jsonOutput = prettier.format(ctx.jsonOutput, { parser: "json" });
        if (ctx.jsonOutput.slice(-1) !== "\n") ctx.jsonOutput += "\n";
      }
    } catch (_err) {
      // Can't throw because this middleware typically appears before error
      // catching middleware (so that it can output error messages)
      ctx.jsonOutput = ERROR_JSON;
    }
  };
};
