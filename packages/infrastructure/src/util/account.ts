import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { withStackTransformation } from "./provider";

/** Creates a set of resources using a specific AWS account. This will attempt
 * to assume the admin role of the specified account. */
export const withAccount = <T>(
  sessionId: string,
  accountId: pulumi.Input<string>,
  roleName: pulumi.Input<string>,
  callback: () => T
): T => {
  const awsProviderProdAccount = new aws.Provider("prod-account-role", {
    assumeRole: {
      roleArn: pulumi.interpolate`arn:aws:iam::${accountId}:role/${roleName}`,
      sessionName: "PulumiSession",
      externalId: "PulumiApplication",
    },
    region: aws.config.requireRegion(),
  });
  const parent = new pulumi.ComponentResource(
    `AlgWiki/${sessionId}`,
    sessionId,
    {},
    { providers: [awsProviderProdAccount] }
  );
  return withStackTransformation(({ props, opts }) => {
    // Note: this is discouraged by Pulumi because transformers will not be updated,
    //       meaning transformers on the new parent will not be applied
    if (!opts.parent) opts.parent = parent;
    return { props, opts };
  }, callback);
};
