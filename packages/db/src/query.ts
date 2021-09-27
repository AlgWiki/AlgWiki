/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type */
import { DynamoDB } from "aws-sdk";

import {
  Challenge,
  Submission,
  User,
  UserCompleted,
  UserLogin,
} from "./records";
import { table } from "./table";
import { Language, getRecord, query } from "./util";

export const listPublicChallenges = async (
  db: DynamoDB.DocumentClient,
  limit: number,
  startKey?: Challenge.Id
) => {
  const challenges = [];
  for await (const challenge of query<Challenge.Record>()({
    db,
    table,
    index: "gsi2",
    key: { pk2: "chl" },
    startKey: startKey && {
      pk2: { S: "chl" },
      sk1: { S: startKey },
    },
    limit,
  }))
    challenges.push(challenge);
  return challenges;
};

export const listCompletedChallengeIds = async (
  db: DynamoDB.DocumentClient,
  userId: User.Id
) => {
  const completed = await getRecord<UserCompleted.Record>()({
    db,
    table,
    key: { pk0: `${userId}/done`, sk0: 0 },
  });
  return completed?.done ?? [];
};

export const getChallengeById = async (
  db: DynamoDB.DocumentClient,
  challengeId: Challenge.Id
) => {
  for await (const challenge of query<Challenge.Record>()({
    db,
    table,
    key: { pk0: challengeId },
    limit: 1,
  }))
    return challenge;
  return undefined;
};

export const listChallengeSubsByScore = async (
  db: DynamoDB.DocumentClient,
  challengeId: Challenge.Id,
  limit: number,
  startKey?: Submission.Id
) => {
  const submissions = [];
  for await (const submission of query<Submission.Record>()({
    db,
    table,
    index: "gsi2",
    key: { pk2: challengeId },
    startKey: startKey && {
      pk2: { S: challengeId },
      sk1: { S: startKey },
    },
    limit,
  }))
    submissions.push(submission);
  return submissions;
};

export const listChallengeSubsForLangByScore = async (
  db: DynamoDB.DocumentClient,
  challengeId: Challenge.Id,
  lang: Language,
  limit: number,
  startKey?: Submission.Id
) => {
  const challengeLangKey = `${challengeId}/${lang}`;
  const submissions = [];
  for await (const submission of query<Submission.Record>()({
    db,
    table,
    index: "gsi3",
    key: { pk3: challengeLangKey },
    startKey: startKey && {
      pk3: { S: challengeLangKey },
      sk1: { S: startKey },
    },
    limit,
  }))
    submissions.push(submission);
  return submissions;
};

export const getSubmissionById = async (
  db: DynamoDB.DocumentClient,
  submissionId: Submission.Id
) => {
  for await (const submission of query<Submission.Record>()({
    db,
    table,
    key: { pk0: submissionId },
    limit: 1,
  }))
    return submission;
  return undefined;
};

export const listCreatedChallengesByCreationTime = async (
  db: DynamoDB.DocumentClient,
  userId: User.Id,
  limit: number,
  startKey?: number
) => {
  const authorKey = `chl/${userId}`;
  const challenges = [];
  for await (const challenge of query<Challenge.Record>()({
    db,
    table,
    index: "gsi1",
    key: { pk1: authorKey },
    startKey:
      startKey !== undefined
        ? {
            pk1: { S: authorKey },
            sk0: { N: startKey },
          }
        : undefined,
    limit,
  }))
    challenges.push(challenge);
  return challenges;
};

export const listUsersByScore = async (
  db: DynamoDB.DocumentClient,
  limit: number,
  startKey?: number
) => {
  const users = [];
  for await (const user of query<User.Record>()({
    db,
    table,
    index: "gsi1",
    key: { pk1: "user" },
    startKey:
      startKey !== undefined
        ? {
            pk1: { S: "user" },
            sk0: { N: startKey },
          }
        : undefined,
    limit,
  }))
    users.push(user);
  return users;
};

export const getUserById = async (
  db: DynamoDB.DocumentClient,
  userId: User.Id
) => {
  for await (const user of query<User.Record>()({
    db,
    table,
    key: { pk0: userId },
    limit: 1,
  }))
    return user;
  return undefined;
};

export const listSubmissionsForUserByTime = async (
  db: DynamoDB.DocumentClient,
  userId: User.Id,
  limit: number,
  startKey?: number
) => {
  const authorKey = `sub/${userId}`;
  const submissions = [];
  for await (const submission of query<Submission.Record>()({
    db,
    table,
    index: "gsi1",
    key: { pk1: authorKey },
    startKey:
      startKey !== undefined
        ? {
            pk1: { S: authorKey },
            sk0: { N: startKey },
          }
        : undefined,
    limit,
  }))
    submissions.push(submission);
  return submissions;
};

export const getUserIdByLogin = async (
  db: DynamoDB.DocumentClient,
  provider: string,
  loginId: UserLogin.Id
) => {
  const login = await getRecord<UserLogin.Record>()({
    db,
    table,
    key: { pk0: `login/${provider}/${loginId}`, sk0: 0 },
  });
  return login?.user;
};
