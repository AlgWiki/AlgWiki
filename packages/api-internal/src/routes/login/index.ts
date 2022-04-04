import { O2Api } from "@oxy2/backend";

import { github } from "./github";

export const login = new O2Api({
  routes: {
    github,
  },
});
