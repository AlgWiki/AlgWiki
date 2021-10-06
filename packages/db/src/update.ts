import crypto from "crypto";

import { DynamoDB } from "aws-sdk";

import {
  Submission,
  SubmissionRecord,
  User,
  UserLogin,
  UserRecord,
} from "./records";
import { Table, table } from "./table";
import { AnyDbTable, RuntimeTable, TableKeys } from "./util";

export const putRecord = <RecordType>() =>
  async function put<Table extends AnyDbTable>(opts: {
    db: DynamoDB.DocumentClient;
    table: RuntimeTable & { __type: Table };
    item: Pick<Table["attrs"], Table["index"]["hashKey" | "rangeKey"]> &
      RecordType;
  }): Promise<void> {
    await opts.db
      .put({
        TableName: opts.table.name,
        Item: opts.item,
      })
      .promise();
  };

const ID_LEN = 16;
const ID_CHARS = [
  ...Array(10).keys(),
  ...[...Array(26).keys()].map((i) => String.fromCharCode(65 + i, 97 + i)),
].join("");
const randId = (): string =>
  [...crypto.randomBytes(ID_LEN)]
    .map((byte) => ID_CHARS[Math.floor((byte / 256) * ID_CHARS.length)])
    .join("");

const createRecordAdd =
  <RecordType extends TableKeys<Table>, Value>(
    toRecord: (value: Value) => RecordType
  ) =>
  async (db: DynamoDB.DocumentClient, value: Value): Promise<RecordType> => {
    const record = toRecord(value);
    // TODO: Validate data before adding (fields like name are returned as-is from
    //       GitHub API and could cause problems if GitHub decides to not return the name)
    await putRecord<RecordType>()({ db, table, item: record });
    return record;
  };

export const addUserLogin = createRecordAdd(UserLogin.toRecord);

export const addUser = createRecordAdd(
  (value: Omit<Parameters<typeof User.toRecord>[0], "id">): UserRecord =>
    User.toRecord({
      id: `user-${randId()}`,
      ...value,
    })
);

export const addSubmission = createRecordAdd(
  (
    value: Omit<Parameters<typeof Submission.toRecord>[0], "id">
  ): SubmissionRecord =>
    Submission.toRecord({
      id: `sub-${randId()}`,
      ...value,
    })
);
