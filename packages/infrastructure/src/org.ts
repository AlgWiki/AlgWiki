import * as aws from "@pulumi/aws";

import { createRepo } from "./repo";
import { createManagementUsers } from "./users";
import { config } from "./util/config";
import { withProtect } from "./util/protect";

const DEFAULT_ADMIN_ROLE_NAME = "Admin";

export const createOrg = async () =>
  withProtect([], async () => {
    // On the first time this will require running Pulumi using the root user's
    // credentials because the IAM users will not exist yet
    const org = new aws.organizations.Organization("algwiki-org", {
      featureSet: "ALL",
    });

    const baseDomain = config.require("baseDomain");

    const devAccount = new aws.organizations.Account(
      "development-account",
      {
        name: "Development",
        email: `admin-dev@${baseDomain}`,
        roleName: DEFAULT_ADMIN_ROLE_NAME,
      },
      { dependsOn: org }
    );

    const prodAccount = new aws.organizations.Account(
      "production-account",
      {
        name: "Production",
        email: `admin-prod@${baseDomain}`,
        roleName: DEFAULT_ADMIN_ROLE_NAME,
      },
      { dependsOn: org }
    );

    const users = org.masterAccountId.apply((id) =>
      createManagementUsers(id, devAccount)
    );

    const ghBotKey = users.botUsers["github-actions-admin"].accessKey;
    const repo = await createRepo(ghBotKey.id, ghBotKey.secret);

    return { devAccount, prodAccount, users, repo };
  });
