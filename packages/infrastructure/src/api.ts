import * as awsx from "@pulumi/awsx";

import { createLambdas, getPulumiRoute } from "./util/lambda";

export const api = new awsx.apigateway.API("api", {
  routes: createLambdas([require("../../routes/src/routes/login-github")]).map(
    ({ route, lambda }) => getPulumiRoute(route, lambda)
  ),
});
