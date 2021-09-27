import * as t from "runtypes";

import { ClientError, createRoute } from "../util";

export const submitSolution = createRoute({
  key: "submit-solution",
  input: t.Record({ lang: t.String, code: t.String }),
  callback: async ({ lang, code }) => {
    if (lang !== "javascript") throw new ClientError("Unsupported language");
    console.log("solution submitted", { code });
    return { msg: "submitted" };
  },
});
