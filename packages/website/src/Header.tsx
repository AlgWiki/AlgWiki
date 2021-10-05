import * as React from "react";

import { Button } from "@material-ui/core";
import { GitHub } from "@material-ui/icons";

const GITHUB_APP_CLIENT_ID = "Iv1.c3eab7d2d6f35a8a";

const getGithubOauthUrl = (): string =>
  `https://github.com/login/oauth/authorize?${new URLSearchParams({
    client_id: GITHUB_APP_CLIENT_ID,
    redirect_uri: `${window.location.origin}/login/github`,
  })}`;

export const Header: React.FC = () => (
  <div>
    <Button
      variant="contained"
      href={getGithubOauthUrl()}
      startIcon={<GitHub />}
    >
      Login
    </Button>
  </div>
);
