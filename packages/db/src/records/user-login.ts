import { Table } from "../table";
import { DbRecord, defineRecordType } from "../util";
import { UserId } from "./user";

export type LoginProvider = "github";

export type UserLoginId = `login/${LoginProvider}/${string}`;
const loginIdPattern = /^login\/([^/]+)\/(.+)$/;
export const buildUserLoginId = (
  provider: LoginProvider,
  id: string
): UserLoginId => `login/${provider}/${id}`;

export interface UserLogin {
  provider: LoginProvider;
  id: string;
  userId: UserId;
}

export type UserLoginRecord = DbRecord<
  Table,
  null,
  { pk0: UserLoginId; sk0: 0; user: UserId }
>;

export const UserLogin = defineRecordType<
  UserLoginId,
  UserLogin,
  UserLoginRecord
>({
  name: "login",
  isId: (id): id is UserLoginId => id.startsWith("login/"),
  toRecord: (userLogin) => ({
    pk0: buildUserLoginId(userLogin.provider, userLogin.id),
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
