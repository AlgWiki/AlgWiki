/* eslint-disable @typescript-eslint/no-unused-vars */

/** The data we need to store for each type of record. */
type RecordData = {
  user: {
    userUuid: string;
    name: string;
    avatarUrl: string;
    score: string;
  };
  userCompleted: {
    userUuid: string;
    challenges: string[];
  };
  userLogin: {
    /** eg. `github/UserIdFromGithubApi123 */
    loginId: string;
    userUuid: string;
  };
  challenge: {
    challengeUuid: string;
    authorUserUuid: string;
    endTimestamp: number;
    createdTimestamp: number;
    name: string;
    description: string;
    functionType: unknown;
    testCases: unknown[];
  };
  submission: {
    submissionUuid: string;
    challengeUuid: string;
    authorUserUuid: string;
    timestamp: number;
    lang: string;
    code: string;
    score: number;
    executionTime: number;
    memoryUsage: number;
  };
};

/**
 * Data access patterns which our table needs to handle:
 * - List public challenges by end time with user completion status (challenge picker)
 * - Get challenge for ID (view challenge, edit challenge)
 * - List ranked submissions for challenge ID by score (challenge leaderboard)
 * - List ranked submissions for challenge ID and language by score (challenge language leaderboard)
 * - Get submission for ID (view challenge solution, view submission)
 * - List challenges for user by creation time (challenge editor picker)
 * - List users by score (global leaderboard)
 * - Get user for ID (view profile)
 * - List ranked submissions for user by time (view profile)
 * - Get user for login ID (login)
 */

/** Mapping of data access queries to required pk+sk data from records.
 * Used for reference when calculating the final schema next. */
type RecordIndexKeys = {
  user: [
    // Get user for ID (view profile)
    { pk: "userUuid" },
    // List users by score (global leaderboard)
    { sk: "score" }
  ];
  userCompleted: [
    // List solved challenges for user (challenge picker)
    { pk: "userUuid" }
  ];
  userLogin: [
    // Get user for login ID (login)
    { pk: "loginId" }
  ];
  challenge: [
    // Get challenge for ID (view challenge, edit challenge)
    { pk: "challengeUuid" },
    // List public challenges by end time (challenge picker)
    { sk: "endTimestamp" },
    // List challenges for user by creation time (challenge editor picker)
    { pk: "authorUserUuid"; sk: "createdTimestamp" }
  ];
  submission: [
    // Get submission for ID (view challenge solution, view submission)
    { pk: "submissionUuid" },
    // List ranked submissions for challenge ID by score (challenge leaderboard)
    { pk: "challengeUuid"; sk: "score" },
    // List ranked submissions for challenge ID and language by score (challenge language leaderboard)
    { pk: "challengeUuid+lang"; sk: "score" },
    // List ranked submissions for user by time (view profile)
    { pk: "authorUserUuid"; sk: "timestamp" },
    { pk: "authorUserUuid"; sk: "score" }
  ];
};

/** Mappings of pk+sk indexes to fields in the `RecordIndexSchema` below for the
 * main index along with other GSIs. Comment is records returned by queries it is used in. */
type Indexes = [
  { pk: "pk0"; sk: "sk0" }, // all
  { pk: "pk1"; sk: "sk0" }, // submission, challenge, user
  { pk: "pk2"; sk: "sk1" }, // submission, challenge
  { pk: "pk3"; sk: "sk1" } // submission
];

// Bottleneck for GSIs is submissions, with all of the indexes above being used for the
// different submission queries.

/** Fields used as index keys. Format is `{ [recordName]: { [fieldName]: [fieldValue, ...interpolatedData] } }`.
 * Data from `RecordData` will be included in addition to these fields. */
type RecordIndexSchema = {
  user: {
    pk0: [string, "userUuid"];
    sk0: [number, "score"];
    pk1: ["user"];
  };
  userCompleted: {
    pk0: [`${string}/done`, "userUuid"];
  };
  userLogin: {
    pk0: [`${string}/${string}`, "loginMethod", "loginId"];
  };
  challenge: {
    pk0: [string, "challengeUuid"];
    sk0: [number, "createdTimestamp"];
    pk1: [`chl/${string}`, "authorUserUuid"];
    pk2: ["chl"];
    sk1: [number, "endTimestamp"];
  };
  submission: {
    pk0: [string, "submissionUuid"];
    sk0: [number, "timestamp"];
    pk1: [`sub/${string}`, "authorUserUuid"];
    pk2: [string, "challengeUuid"];
    pk3: [`${string}/${string}`, "challengeUuid", "lang"];
    sk1: [number, "score"];
  };
};

/** Pseudo-code for all the DynamoDB queries we'll need to make using the fields in `RecordIndexSchema`.
 * Note that for every query the first assertion must be a partition key and the second and order (if they
 * exist) must be a matching range key for one of the indexes in `Indexes`. */
type Queries = [
  // List public challenges by end time with user completion status (challenge picker)
  `query pk2:chl order by sk1`,
  `get pk0:${"userUuid"}/done`, // manually joined with query above
  // Get challenge for ID (view challenge, edit challenge)
  `get pk0:${"challengeUuid"}`,
  // List ranked submissions for challenge ID by score (challenge leaderboard)
  `query pk2:${"challengeUuid"} order by sk1`,
  // List ranked submissions for challenge ID and language by score (challenge language leaderboard)
  `query pk3:${"challengeUuid"}/${"lang"} order by sk1`,
  // Get submission for ID (view challenge solution, view submission)
  `get pk0:${"submissionUuid"}`,
  // List challenges for user by creation time (challenge editor picker, view profile)
  `query pk1:chl/${"authorUserUuid"} order by sk0`,
  // List users by score (global leaderboard)
  `query pk1:user order by sk0`,
  // Get user for ID (view profile)
  `get pk0:${"userUuid"}`,
  // List ranked submissions for user by time (view profile)
  `query pk1:sub/${"userUuid"} order by sk0`,
  // Get user for login ID (login)
  `get pk0:${"loginId"}`
];

// The last step when planning a schema is choosing which data to project on the GSIs but that should
// be trivial so it will be done during implementation.

// Known issues:
// - Some GSI partition keys do not have good distribution (`pk1=user` and `pk2=chl`) but it's probably still
//   the most efficient solution for the size of the DB, may need to revisit in future... (maybe include date
//   for challenges and rough rank like `floor(score/10000)` for users?)
// - Listing challenges with current user completion status requires a manual join, with IDs of all completed
//   challenges loaded from ddb but should be fine for DB size. Maybe could be cached on frontend. May need to revisit in future...
// - The GSIs have been overloaded so we have the least number of GSIs possible. I think giving some queries their
//   own (sparse) GSIs would be faster and use less space... (though not strictly necessary)
