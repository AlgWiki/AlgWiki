import { Table } from "../table";
import { DbRecord, defineRecordType } from "../util";

export type Id = `user-${string}`;

export interface Type {
  id: Id;
  name: string;
  avatarUrl?: string;
  globalScore: number;
  joinDate: Date;
}

export type Record = DbRecord<
  Table,
  null,
  {
    pk1: string;
    name: string;
    avatar?: string;
    score: number;
    joined: number;
  }
>;

export const { isId, toRecord, fromRecord } = defineRecordType<
  Id,
  Type,
  Record
>({
  name: "user",
  isId: (id): id is Id => id.startsWith("user-"),
  toRecord: (user) => ({
    pk0: user.id,
    sk0: user.globalScore,
    pk1: "user",
    name: user.name,
    avatar: user.avatarUrl,
    score: user.globalScore,
    joined: user.joinDate.getTime(),
  }),
  fromRecord: (record) => ({
    id: record.pk0,
    name: record.name,
    avatarUrl: record.avatar,
    globalScore: record.sk0,
    joinDate: new Date(record.joined),
  }),
});

export const getName = (user: Partial<Pick<Record, "name">>): string =>
  user.name ?? "Unknown User";
