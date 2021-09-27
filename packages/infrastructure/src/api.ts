import * as awsx from "@pulumi/awsx";

import { submitSolution } from "./routes/submit-solution";

export const api = new awsx.apigateway.API("api", {
  routes: [submitSolution],
});
