import { Table } from "../table";
import { DbRecord, defineRecordType } from "../util";
import { Id as UserId } from "./user";

export type Id = `${UserId}/done`;

export interface Type {
  userId: UserId;
  completedChallengeIds: Set<string>;
}

export type Record = DbRecord<Table, null, { done: string[] }>;

export const { isId, toRecord, fromRecord } = defineRecordType<
  Id,
  Type,
  Record
>({
  name: "completed",
  isId: (id): id is Id => id.startsWith("user-") && id.endsWith("/done"),
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
