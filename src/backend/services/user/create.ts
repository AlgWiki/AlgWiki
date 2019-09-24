import argon2 from 'argon2'

import { User } from '../../../common/model/user/type';

export const create = async ({
  email,
  displayName,
  password,
}: {
  email: string;
  displayName: string;
  password: string;
}): Promise<User> => {
  return {
    id: 1,
    email,
    displayName,
    passwordHash: await argon2.hash(password),
  };
};
