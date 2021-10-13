import * as React from "react";

import { GITHUB_LOGIN_PATH, GITHUB_OAUTH_CLIENT_ID } from "@algwiki/common";
import { Button } from "@material-ui/core";
import { GitHub } from "@material-ui/icons";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";

const getGithubOauthUrl = (): string =>
  `https://github.com/login/oauth/authorize?${new URLSearchParams({
    client_id: GITHUB_OAUTH_CLIENT_ID,
    redirect_uri: GITHUB_LOGIN_PATH,
  })}`;

export const useLogin = (): void => {
  const githubLoginPath = new URL(GITHUB_LOGIN_PATH).pathname;
  const match = useRouteMatch(githubLoginPath);
  const location = useLocation();
  const history = useHistory();
  React.useEffect(() => {
    if (!match) return;
    const code = new URLSearchParams(location.search).get("code");
    if (!code) return;
    console.log({ code });
    history.replace(githubLoginPath);
  }, [match]);
};

export const GithubLoginButton: React.FC = () => (
  <Button variant="contained" href={getGithubOauthUrl()} startIcon={<GitHub />}>
    Login
  </Button>
);
