import { Table } from "../table";
import { DbRecord, defineRecordType } from "../util";
import { Id as UserId } from "./user";

export type LoginProvider = "github";

export type Id = `login/${LoginProvider}/${string}`;
const loginIdPattern = /^login\/([^/]+)\/(.+)$/;

export interface Type {
  provider: LoginProvider;
  id: string;
  userId: UserId;
}

export type Record = DbRecord<Table, null, { user: UserId }>;

export const { isId, toRecord, fromRecord } = defineRecordType<
  Id,
  Type,
  Record
>({
  name: "login",
  isId: (id): id is Id => id.startsWith("login/"),
  toRecord: (userLogin) => ({
    pk0: userLogin.id,
    sk0: 0,
    user: userLogin.userId,
  }),
  fromRecord: (record) => {
    const [, provider, id] = loginIdPattern.exec(record.pk0)!;
    return {
      provider: provider as LoginProvider,
      id,
      userId: record.user,
    };
  },
});
