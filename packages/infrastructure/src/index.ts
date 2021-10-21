import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { createApiGateway } from "./api-internal";
import { createTable } from "./db";
import { createOrg } from "./org";
import { withAccount } from "./util/account";
import { autoTagsTransformation } from "./util/tags";

// Tag all resources with the current stack name
const stack = pulumi.getStack();
pulumi.runtime.registerStackTransformation(
  autoTagsTransformation({ pulumi: stack })
);

const isProd = stack === "prod";
// TODO: Check that we're logged into the management account before making org changes
const managementChanges = isProd ? pulumi.output(createOrg()) : null;

export const org = managementChanges?.apply((org) => {
  const getAccountOutputs = (account: aws.organizations.Account) => ({
    name: account.name,
    id: account.id,
    adminEmail: account.email,
    adminRole: account.roleName,
  });
  return {
    repo: org.repo.fullName,
    dev: getAccountOutputs(org.devAccount),
    prod: getAccountOutputs(org.prodAccount),
    users: {
      admins: org.users.adminUsers.map((user) => user.name),
      bots: Object.values(org.users.botUsers).map(({ user }) => user.name),
    },
  };
});

const createAppChanges = () => {
  const table = createTable();
  const apiGateway = createApiGateway(table);
  return { table, apiGateway };
};
const appChanges = isProd
  ? withAccount(
      "app",
      managementChanges!.prodAccount.id,
      managementChanges!.prodAccount.roleName as pulumi.Output<string>,
      createAppChanges
    )
  : createAppChanges();

export const apiInternalUrl =
  appChanges.apiGateway.apiInternalDomain.domainName;
export const dbName = appChanges.table.name;
