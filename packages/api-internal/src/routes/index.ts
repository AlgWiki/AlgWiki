import { O2Api } from "@oxy2/backend";

import { login } from "./login";

export const api = new O2Api({
  routes: {
    login,
  },
});
