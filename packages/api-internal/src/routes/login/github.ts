import { GITHUB_LOGIN_PATH, GITHUB_OAUTH_CLIENT_ID } from "@algwiki/common";
import {
  User,
  addUser,
  addUserLogin,
  createDbClient,
  getUserIdByLogin,
} from "@algwiki/db";
import { O2Endpoint } from "@oxy2/backend";
import axios, { AxiosResponse } from "axios";

import { SESSION_JWT_COOKIE, generateSessionJwt } from "../../util/auth";
import { ServerError } from "../../util/route";
import { requireSecret } from "../../util/secrets";
import { CookieOpts, HttpReq } from "../../util/types";

export const github = new O2Endpoint({
  async createCallback() {
    const [githubOauthClientSecret, sessionJwtPrivateKey] = await Promise.all([
      requireSecret("GithubOauthClientSecret"),
      requireSecret("SessionJwtPrivateKey"),
    ]);

    const getLoginCookie = (userId: string): CookieOpts => ({
      name: SESSION_JWT_COOKIE,
      value: generateSessionJwt(sessionJwtPrivateKey, userId),
      httpOnly: true,
      path: "/",
    });

    return async (
      input: { /** GitHub OAuth code. */ code: string },
      req: HttpReq
    ) => {
      const accessTokenRes = await axios.post<
        Record<string, string>,
        AxiosResponse<{ access_token: string }>
      >("https://github.com/login/oauth/access_token", {
        client_id: GITHUB_OAUTH_CLIENT_ID,
        client_secret: githubOauthClientSecret,
        code: input.code,
        redirect_uri: GITHUB_LOGIN_PATH,
      });
      const accessToken = new URLSearchParams(accessTokenRes.data).get(
        "access_token"
      );
      if (!accessToken) {
        console.error("Error getting GitHub access token", accessTokenRes.data);
        throw new ServerError("Error accessing GitHub API");
      }

      const userIdRes = await axios.post<
        Record<string, string>,
        AxiosResponse<{
          data?: {
            viewer?: {
              databaseId: number;
              login: string;
              avatarUrl: string;
            };
          };
          errors?: unknown[];
        }>
      >(
        "https://api.github.com/graphql",
        {
          query: `
  query {
    viewer {
      databaseId
      login
      avatarUrl
    }
  }`,
        },
        { headers: { Authorization: `bearer ${accessToken}` } }
      );
      const githubUser = userIdRes.data.data?.viewer;
      if (!githubUser) {
        console.error("Error getting GitHub user ID", userIdRes.data.errors);
        throw new ServerError("Error accessing GitHub API");
      }

      const db = createDbClient();
      const userId = await getUserIdByLogin(
        db,
        "github",
        `${githubUser.databaseId}`
      );
      if (userId) {
        console.log("User logged in", { id: userId });
        req.setCookie(getLoginCookie(userId));
        return {
          result: "logged in",
          userId,
        };
      }

      const user = User.fromRecord(
        await addUser(db, {
          name: githubUser.login,
          globalScore: 0,
          joinDate: new Date(),
          avatarUrl: githubUser.avatarUrl,
        })
      );
      // TODO: We should handle the case where a user is created but the login record
      //       fails to create (periodically delete users with no login?)
      await addUserLogin(db, {
        provider: "github",
        id: `${githubUser.databaseId}`,
        userId: user.id,
      });
      console.log("User signed up", { id: user.id });
      req.setCookie(getLoginCookie(user.id));
      return {
        result: "signed up",
        userId: user.id,
      };
    };
  },
});
