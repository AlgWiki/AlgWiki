import path from "path";

import * as github from "@pulumi/github";
import * as pulumi from "@pulumi/pulumi";
import * as fse from "fs-extra";
import { PackageJson } from "type-fest";

import { config, getAdmins } from "./util/config";
import { withProtect } from "./util/protect";
import { withStackTransformation } from "./util/provider";

export const createRepo = async (
  awsAccessKeyId: pulumi.Input<string>,
  awsSecretAccessKey: pulumi.Input<string>
) =>
  withProtect([], async () => {
    const monorepoPackageJson = (await fse.readJson(
      path.join(__dirname, "..", "..", "..", "package.json")
    )) as PackageJson;

    const repo = new github.Repository("repo", {
      name: "AlgWiki",
      description: monorepoPackageJson.description,
      topics: monorepoPackageJson.keywords,
      hasIssues: true,
      hasProjects: true,
      hasWiki: false,
      vulnerabilityAlerts: true,
    });
    const defaultBranch = new github.BranchDefault("repo-default-branch", {
      repository: repo.name,
      branch: "main",
    });
    new github.BranchProtection("repo-branch-protect-main", {
      repositoryId: repo.nodeId,
      pattern: defaultBranch.branch,
      enforceAdmins: false,
      allowsDeletions: false,
      allowsForcePushes: false,
    });

    const admins = getAdmins();
    for (const { githubUsername } of admins)
      new github.Membership(`github-org-member-${githubUsername}`, {
        username: githubUsername,
        role: "admin",
      });

    const adminTeam = new github.Team("github-admin-team", {
      name: "Admins",
      privacy: "closed",
    });
    for (const { githubUsername } of admins) {
      new github.TeamMembership(`github-admin-member-${githubUsername}`, {
        teamId: adminTeam.id,
        username: githubUsername,
        role: "maintainer",
      });
      new github.RepositoryCollaborator(
        `github-repo-collab-${githubUsername}`,
        {
          repository: repo.id,
          username: githubUsername,
          permission: "admin",
        }
      );
    }

    new github.RepositoryEnvironment("repo-env-release", {
      repository: repo.name,
      environment: "Release",
      deploymentBranchPolicy: {
        protectedBranches: true,
        customBranchPolicies: false,
      },
    });

    withStackTransformation(
      ({ props, opts }) => ({ props, opts: { ...opts, protect: false } }),
      () => {
        new github.ActionsSecret("repo-secret-netlify-token", {
          repository: repo.name,
          secretName: "NETLIFY_ACCESS_TOKEN",
          plaintextValue: config.requireSecret("netlifyAccessToken"),
        });
        new github.ActionsSecret("repo-secret-aws-access-key-id", {
          repository: repo.name,
          secretName: "AWS_ACCESS_KEY_ID",
          plaintextValue: awsAccessKeyId,
        });
        new github.ActionsSecret("repo-secret-aws-secret-access-key", {
          repository: repo.name,
          secretName: "AWS_SECRET_ACCESS_KEY",
          plaintextValue: awsSecretAccessKey,
        });
      }
    );

    return repo;
  });
