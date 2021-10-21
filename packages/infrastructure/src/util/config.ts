import * as pulumi from "@pulumi/pulumi";

export const config = new pulumi.Config();

export const getAdmins = () =>
  config.requireObject<{ githubUsername: string; isBot?: boolean }[]>("admins");
