import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as openpgp from "openpgp";

import { getAdmins } from "./util/config";

export const BOT_USERS = {
  "github-actions-dev": { isDev: true },
  "github-actions-admin": {},
};

const createPgpKeys = async () => {
  const generatedKeys = await openpgp.generateKey({
    type: "rsa",
    rsaBits: 2048,
    userIDs: [{ name: "AlgWiki" }],
    format: "binary",
  });
  const createParameter = (name: string, defaultKey: ArrayBuffer) =>
    new aws.ssm.Parameter(
      name,
      {
        name,
        type: "SecureString",
        value: pulumi.secret(Buffer.from(defaultKey).toString("base64")),
      },
      { ignoreChanges: ["value"] }
    );
  return {
    privateKey: createParameter("pgp-private-key", generatedKeys.privateKey),
    publicKey: createParameter("pgp-public-key", generatedKeys.publicKey),
  };
};

const getAccountProvider = (
  accountName: string,
  account: aws.organizations.Account
) =>
  new aws.Provider(`account-provider-${accountName}`, {
    region: aws.config.requireRegion(),
    assumeRole: {
      roleArn: pulumi.interpolate`arn:aws:iam::${account.id}:role/${account.roleName}`,
    },
  });

const createInlinePolicy = (policy: aws.iam.PolicyDocument): string =>
  JSON.stringify(policy);

export const createManagementUsers = (
  managementAccountId: string,
  devAccount: aws.organizations.Account
) => {
  const devProvider = getAccountProvider("dev", devAccount);
  const passwordPolicy = new aws.iam.AccountPasswordPolicy("password-policy", {
    allowUsersToChangePassword: true,
    minimumPasswordLength: 8,
  });

  const pgp = pulumi.output(createPgpKeys());

  const botUserEntries: [string, { isDev?: boolean }][] =
    Object.entries(BOT_USERS);
  const botUsers = Object.fromEntries(
    botUserEntries.map(([name, { isDev }]) => {
      const user = new aws.iam.User(
        `${name}-user`,
        { name },
        { provider: isDev ? devProvider : undefined }
      );
      const accessKey = new aws.iam.AccessKey(
        `${name}-user-access-key`,
        { user: user.name },
        { provider: isDev ? devProvider : undefined }
      );
      return [name, { user, accessKey }];
    })
  ) as Record<
    keyof typeof BOT_USERS,
    { user: aws.iam.User; accessKey: aws.iam.AccessKey }
  >;

  const adminUsers = getAdmins().flatMap(({ githubUsername, isBot }) => {
    if (isBot) return [];
    const user = new aws.iam.User(`${githubUsername}-user`, {
      name: githubUsername,
    });
    new aws.iam.UserLoginProfile(`${githubUsername}-user-pw`, {
      user: user.name,
      pgpKey: pgp.publicKey.value,
      passwordLength: passwordPolicy.minimumPasswordLength.apply(
        (len) => len ?? 8
      ),
      passwordResetRequired: true,
    });
    return [user];
  });

  const infrastructureGroup = new aws.iam.Group("infrastructure-group", {
    name: "Infrastructure",
  });
  new aws.iam.GroupPolicyAttachment("administrator-access-attach", {
    group: infrastructureGroup,
    policyArn: "arn:aws:iam::aws:policy/AdministratorAccess",
  });
  new aws.iam.GroupMembership("infrastructure-members", {
    group: infrastructureGroup.name,
    users: botUserEntries.flatMap(([name, { isDev }]) => (isDev ? [] : [name])),
  });

  const adminGroup = new aws.iam.Group("admin-group", {
    name: "Admins",
  });
  new aws.iam.GroupPolicy("admin-policy", {
    group: adminGroup.name,
    policy: createInlinePolicy({
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "AdministratorAccessWithMfa",
          Effect: "Allow",
          Action: "*",
          Resource: "*",
          Condition: {
            Bool: {
              "aws:MultiFactorAuthPresent": "true",
            },
          },
        },
        {
          Sid: "EnableMfaForCurrentUser",
          Effect: "Allow",
          Action: [
            "iam:EnableMFADevice",
            "iam:CreateVirtualMFADevice",
            "iam:ListMFADevices",
          ],
          Resource: [
            `arn:aws:iam::${managementAccountId}:user/\${aws:username}`,
            `arn:aws:iam::${managementAccountId}:mfa/*`,
          ],
        },
      ],
    }),
  });
  new aws.iam.GroupMembership("admin-members", {
    group: adminGroup.name,
    users: adminUsers.map((user) => user.name),
  });

  return {
    botUsers,
    adminUsers,
    groups: { infrastructureGroup, adminGroup },
  };
};
