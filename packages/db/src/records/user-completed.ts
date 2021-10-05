import { Table } from "../table";
import { DbRecord, defineRecordType } from "../util";
import { UserId } from "./user";

export type UserCompletedId = `${UserId}/done`;

export interface UserCompleted {
  userId: UserId;
  completedChallengeIds: Set<string>;
}

export type UserCompletedRecord = DbRecord<Table, null, { done: string[] }>;

export const UserCompleted = defineRecordType<
  UserCompletedId,
  UserCompleted,
  UserCompletedRecord
>({
  name: "completed",
  isId: (id): id is UserCompletedId =>
    id.startsWith("user-") && id.endsWith("/done"),
  toRecord: (userCompleted) => ({
    pk0: `${userCompleted.userId}/done`,
    sk0: 0,
    done: [...userCompleted.completedChallengeIds],
  }),
  fromRecord: (record) => ({
    userId: record.pk0.split("/")[0] as UserId,
    completedChallengeIds: new Set(record.done),
  }),
});
