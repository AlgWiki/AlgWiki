### Prerequisites

- Pulumi
- Docker
- AWS CLI v2

### Dev

Setting up infra locally:

```sh
yarn workspace @algwiki/infrastructure localstack
yarn workspace @algwiki/infrastructure pulumi up
```

Viewing logs for a resource:

```sh
aws --endpoint-url=http://localhost:4566 logs describe-log-groups
aws --endpoint-url=http://localhost:4566 logs tail /aws/lambda/submit-solution-handler-19ee373 --follow
```

Setting up infra on AWS for dev:

```sh
# yarn workspace @algwiki/infrastructure pulumi stack init dev
yarn workspace @algwiki/infrastructure pulumi stack select dev
yarn workspace @algwiki/infrastructure pulumi up
```

### Administrator access through AWS console

The live AlgWiki stack is only available to a select few. This is mostly to limit the potential of leaking data or breaking the stack (intentional or otherwise) but also to limit cheating since admin access allows viewing the solutions of active challenges in the database. In the future audit logs for the database may become public or solutions by admins which viewed the database while the challenge was active disqualified to prevent potential abuse. There are multiple people for redundancy (in case one admin is unavailable to perform a critical task).

#### Admin links

- [Development](https://signin.aws.amazon.com/switchrole?account=674930382918&roleName=Admin&displayName=%5BDEV%5D+Admin&color=FAD791)
- [Production](https://signin.aws.amazon.com/switchrole?account=068654350440&roleName=Admin&displayName=%5BPROD%5D+Admin&color=F2B0A9)

#### Instructions for creating new admins

- Add the new admin's GitHub username to [Pulumi.prod.yaml](./Pulumi.prod.yaml)
- After merging and running Pulumi their account should be created
- Run: `yarn workspace @algwiki/infrastructure decrypt-passwords`
- Securely send them these instructions (ideally with something encrypted like Signal but email/Discord is alright too since the credentials are only temporary):
  - Go to https://console.aws.amazon.com/console/home to see the sign-in screen (log out if already logged into another account)
  - Select the "IAM user" login type
  - Enter account ID: `ADD_ACCOUNT_ID_HERE`
  - Enter the username: `ADD_USER_NAME_HERE`
  - Enter the password: `ADD_TEMP_PASSWORD_HERE`
  - Change the password to something secure (use a password manager!)
  - You should now be in the console, but you will not have permission to do anything until you've enabled MFA
  - Click on the dropdown with your account name and select `My Security Credentials`
  - Under `Account details` -> `AWS IAM credentials` -> `Multi-factor authentication (MFA)` click on `Assign MFA device` (ignore all the warnings about not having permissions)
  - Follow the steps to enable MFA
    - If you do not have an MFA system already, install the Authy authenticator app on your phone
  - Log out then back in using your new password and MFA
  - You should now be able to access all AlgWiki resources from the AWS console by using the links in the `@algwiki/infrastructure` readme

### Setup from scratch

To create the entire AlgWiki infrastructure including AWS accounts, GitHub repositories and everything:

- **GitHub**
  - Create a GitHub bot account (ie. create a normal account)
  - Create a GitHub organization using the bot account
  - Generate a personal access token for the bot and add it to the Pulumi config as `github:token`
- **Netlify**
  - TODO
- **AWS**
  - Create a new AWS account with any name, root user and billing details you want
  - Create a new IAM user with any name and directly attach the `AdministratorAccess` policy then generate an access key/secret
  - Run `aws configure` and log into this user with the created access key/secret
- **Pulumi**
  - Create and login to a Pulumi account
  - Modify the config in `Pulumi.prod.yaml` as necessary
  - Run:
    ```sh
    yarn workspace @algwiki/infrastructure pulumi stack select prod
    yarn workspace @algwiki/infrastructure pulumi up
    ```
- **Cleanup**
  - Read access keys and passwords for created users by using: `yarn workspace @algwiki/infrastructure decrypt-passwords`
  - Delete the originally created IAM user
