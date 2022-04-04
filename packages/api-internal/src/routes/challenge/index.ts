import { O2Api } from "@oxy2/backend";

import { submit } from "./submit";

export const challenge = new O2Api({
  routes: {
    submit,
  },
});
