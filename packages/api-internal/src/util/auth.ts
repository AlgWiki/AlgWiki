import { ALPHANUM } from "@algwiki/common";
import { randStr } from "@algwiki/common-node";
import type { UserId } from "@algwiki/db";
import type { APIGatewayProxyEvent } from "aws-lambda";
import * as cookie from "cookie";
import * as jwt from "jsonwebtoken";

import { ClientError } from "./route";

const NOT_LOGGED_IN_ERROR = new ClientError("Not logged in", 401);

export const SESSION_JWT_COOKIE = "session";

export const generateSessionJwt = (
  privateKeyPem: string,
  userId: string
): string =>
  jwt.sign({ id: userId, csrf: randStr(8, ALPHANUM) }, privateKeyPem, {
    algorithm: "ES256",
    expiresIn: "90d",
  });

export const requireAuth = async (
  publicKeyPem: string,
  evt: APIGatewayProxyEvent
): Promise<UserId> => {
  if (!evt.headers.cookie) throw NOT_LOGGED_IN_ERROR;
  const cookies = cookie.parse(evt.headers.cookie);
  const token = cookies[SESSION_JWT_COOKIE];
  if (!token) throw NOT_LOGGED_IN_ERROR;
  try {
    const payload = jwt.verify(token, publicKeyPem, {
      algorithms: ["ES256"],
    }) as jwt.JwtPayload & { id: UserId };
    return payload.id;
  } catch (err) {
    throw new ClientError(`Session token: ${(err as Error).message}`);
  }
};
