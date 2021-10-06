import * as React from "react";

import { GithubLoginButton, useLogin } from "./login";

export const Header: React.FC = () => {
  useLogin();

  return (
    <div>
      <GithubLoginButton />
    </div>
  );
};
