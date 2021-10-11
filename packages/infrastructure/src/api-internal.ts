import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

import { createLambdas, getPulumiRoute } from "./util/lambda";

const INTERNAL_API_DOMAIN_NAME = "internal.api.alg.wiki";

export const apiInternal = new awsx.apigateway.API("api", {
  restApiArgs: {
    disableExecuteApiEndpoint: true,
    endpointConfiguration: { types: "REGIONAL" },
  },
  routes: createLambdas([
    require("../../routes/src/routes/login-github"),
    require("../../routes/src/routes/submit-solution"),
  ]).map(({ route, lambda }) => getPulumiRoute(route, lambda)),
});

const apiInternalCert = new aws.acm.Certificate("api-internal-cert", {
  domainName: INTERNAL_API_DOMAIN_NAME,
  validationMethod: "DNS",
});

export const apiInternalDomain = new aws.apigateway.DomainName(
  "api-internal-domain",
  {
    regionalCertificateArn: apiInternalCert.arn,
    domainName: INTERNAL_API_DOMAIN_NAME,
    securityPolicy: "TLS_1_2",
    endpointConfiguration: { types: "REGIONAL" },
  }
);
new aws.apigateway.BasePathMapping("api-internal-domain-mapping", {
  restApi: apiInternal.restAPI,
  stageName: apiInternal.stage.stageName,
  domainName: INTERNAL_API_DOMAIN_NAME,
});
