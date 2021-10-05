import { Table } from "../table";
import { DbRecord, defineRecordType } from "../util";

export type UserId = `user-${string}`;

export interface User {
  id: UserId;
  name: string;
  avatarUrl?: string;
  globalScore: number;
  joinDate: Date;
}

export type UserRecord = DbRecord<
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

export const User = defineRecordType<UserId, User, UserRecord>({
  name: "user",
  isId: (id): id is UserId => id.startsWith("user-"),
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

export const getName = (user: Partial<Pick<UserRecord, "name">>): string =>
  user.name ?? "Unknown User";
