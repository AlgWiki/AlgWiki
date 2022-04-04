import { O2Middleware } from "@oxy2/backend";

import { HttpReq } from "../util/types";

export const csrf: O2Middleware<HttpReq> = () => {
  if (!evt.headers.origin) {
    console.warn("Missing Origin header", {
      userAgent: evt.headers["user-agent"],
    });
    throw new ClientError("Missing Origin header");
  }
  if (!CORS_ALLOWED_DOMAINS.includes(evt.headers.origin))
    throw new ClientError("Origin not allowed to access API");
};
