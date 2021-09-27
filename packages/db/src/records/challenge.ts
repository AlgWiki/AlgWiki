import { Table } from "../table";
import { DbRecord, defineRecordType } from "../util";
import { Id as UserId } from "./user";

export type Id = `chl-${string}`;

export interface Type {
  id: Id;
  authorId: UserId;
  createDate: Date;
  endDate: Date;
  name: string;
  description: unknown;
  functionType: unknown;
  testCases: unknown[];
}

export type Record = DbRecord<
  Table,
  null,
  {
    pk1: `chl/${UserId}`;
    pk2: "chl";
    sk1: number;
    name: string;
    description: unknown;
    functionType: unknown;
    testCases: unknown[];
  }
>;

export const { isId, toRecord, fromRecord } = defineRecordType<
  Id,
  Type,
  Record
>({
  name: "challenge",
  isId: (id): id is Id => id.startsWith("chl-"),
  toRecord: (challenge) => ({
    pk0: challenge.id,
    pk1: `chl/${challenge.authorId}`,
    pk2: "chl",
    sk0: challenge.createDate.getTime(),
    sk1: challenge.endDate.getTime(),
    name: challenge.name,
    description: challenge.description,
    functionType: challenge.functionType,
    testCases: challenge.testCases,
  }),
  fromRecord: (record) => ({
    id: record.pk0,
    authorId: record.pk1.split("/")[1] as UserId,
    createDate: new Date(record.sk0),
    endDate: new Date(record.sk1),
    name: record.name,
    description: record.description,
    functionType: record.functionType,
    testCases: record.testCases,
  }),
});
