import { GITHUB_LOGIN_PATH, GITHUB_OAUTH_CLIENT_ID } from "@alg-wiki/common";
import {
  User,
  addUser,
  addUserLogin,
  createDbClient,
  getUserIdByLogin,
} from "@alg-wiki/db";
import axios, { AxiosResponse } from "axios";

import { Route, ServerError } from "../util/route";
import { requireSecret } from "../util/secrets";

export default new Route({
  key: "login-github",
  callback: async () => {
    const githubOauthClientSecret = await requireSecret(
      "GithubOauthClientSecret"
    );

    return async (input: { /** GitHub OAuth code. */ code: string }) => {
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
        return { result: "logged in", userId };
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
      return { result: "signed up", userId: user.id };
    };
  },
});
