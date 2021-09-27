import { Table } from "../table";
import { DbRecord, Language, defineRecordType } from "../util";
import { Id as ChallengeId } from "./challenge";
import { Id as UserId } from "./user";

export type Id = `sub-${string}`;

export interface Type {
  id: Id;
  challengeId: ChallengeId;
  authorId: UserId;
  timestamp: Date;
  lang: Language;
  code: string;
  score: number;
  executionTime: number;
  memoryUsage: number;
}

export type Record = DbRecord<
  Table,
  null,
  {
    pk1: `sub/${UserId}`;
    pk2: ChallengeId;
    pk3: `${ChallengeId}/${Language}`;
    sk1: number;
    code: string;
    time: number;
    mem: number;
  }
>;

export const { isId, toRecord, fromRecord } = defineRecordType<
  Id,
  Type,
  Record
>({
  name: "submission",
  isId: (id): id is Id => id.startsWith("sub-"),
  toRecord: (submission) => ({
    pk0: submission.id,
    pk1: `sub/${submission.authorId}`,
    pk2: submission.challengeId,
    pk3: `${submission.challengeId}/${submission.lang}`,
    sk0: submission.timestamp.getTime(),
    sk1: submission.score,
    code: submission.code,
    time: submission.executionTime,
    mem: submission.memoryUsage,
  }),
  fromRecord: (record) => ({
    id: record.pk0,
    challengeId: record.pk2,
    authorId: record.pk1.split("/")[1] as UserId,
    timestamp: new Date(record.sk0),
    lang: record.pk3.split("/")[1] as Language,
    code: record.code,
    score: record.sk1,
    executionTime: record.time,
    memoryUsage: record.mem,
  }),
});
