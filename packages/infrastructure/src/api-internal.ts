import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

import { config } from "./util/config";
import { createLambdas, getPulumiRoute } from "./util/lambda";
import * as netlify from "./util/netlify";

const trimBaseDomain = (baseDomain: string, domain: string) => {
  const normalized = domain.trim().replace(/\.$/, "");
  return normalized.endsWith(baseDomain)
    ? normalized.substring(0, -baseDomain.length)
    : normalized;
};

export const createApiGateway = (table: aws.dynamodb.Table) => {
  const apiInternal = new awsx.apigateway.API("api", {
    restApiArgs: {
      disableExecuteApiEndpoint: true,
      endpointConfiguration: { types: "REGIONAL" },
    },
    routes: createLambdas(table, [
      require("../../routes/src/routes/login-github"),
      require("../../routes/src/routes/submit-solution"),
    ]).map(({ route, lambda }) => getPulumiRoute(route, lambda)),
  });

  const baseDomain = config.require("baseDomain");
  const apiInternalCert = new aws.acm.Certificate("api-internal-cert", {
    domainName: `internal.api.${baseDomain}`,
    validationMethod: "DNS",
  });
  const certDnsValidation = apiInternalCert.domainValidationOptions[0];
  new netlify.DnsRecord(
    "api-internal-cert-dns-validation",
    {
      accessToken: config.requireSecret("netlifyAccessToken"),
      zoneId: config.require("netlifyZoneId"),
      type: certDnsValidation.resourceRecordType,
      hostname: certDnsValidation.resourceRecordName.apply((hostname) =>
        trimBaseDomain(baseDomain, hostname)
      ),
      value: certDnsValidation.resourceRecordValue,
      ttl: 1,
    },
    { provider: undefined }
  );

  const apiInternalDomain = new aws.apigateway.DomainName(
    "api-internal-domain",
    {
      regionalCertificateArn: apiInternalCert.arn,
      domainName: apiInternalCert.domainName,
      securityPolicy: "TLS_1_2",
      endpointConfiguration: { types: "REGIONAL" },
    }
  );
  const domainMapping = new aws.apigateway.BasePathMapping(
    "api-internal-domain-mapping",
    {
      restApi: apiInternal.restAPI,
      stageName: apiInternal.stage.stageName,
      domainName: apiInternalDomain.domainName,
    }
  );

  const dnsRecord = new netlify.DnsRecord("api-internal-domain", {
    accessToken: config.requireSecret("netlifyAccessToken"),
    zoneId: config.require("netlifyZoneId"),
    type: "CNAME",
    hostname: apiInternalDomain.domainName,
    value: apiInternalDomain.regionalDomainName,
    ttl: 60 * 60,
  });

  return {
    apiInternal,
    apiInternalCert,
    apiInternalDomain,
    domainMapping,
    dnsRecord,
  };
};
