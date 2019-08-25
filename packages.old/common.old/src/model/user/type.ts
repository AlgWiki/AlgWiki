import { TypeOf } from 'io-ts';
import * as v from '../util/types';
import {
  DISPLAY_NAME_LENGTH_MAX,
  DISPLAY_NAME_LENGTH_MIN,
  AVATAR_URL_LENGTH_MAX,
  ID_LENGTH,
  EMAIL_LENGTH_MAX,
  PASSWORD_LENGTH_MAX,
  PASSWORD_HASH_LENGTH_MAX,
} from '../../config/model/common';

export const Id = v.int('ID', 10 ** ID_LENGTH, 10 ** (ID_LENGTH + 1) - 1);
export type Id = TypeOf<typeof Id>;

export const DisplayName = v.string(
  'display name',
  DISPLAY_NAME_LENGTH_MAX,
  DISPLAY_NAME_LENGTH_MIN,
);
export type DisplayName = TypeOf<typeof DisplayName>;

export const Email = v.email('email', EMAIL_LENGTH_MAX);
export type Email = TypeOf<typeof Email>;

export const AvatarUrl = v.url('avatar URL', AVATAR_URL_LENGTH_MAX);
export type AvatarUrl = TypeOf<typeof AvatarUrl>;

export const Password = v.string('password', PASSWORD_LENGTH_MAX, 1);
export type Password = TypeOf<typeof Password>;

export const PasswordHash = v.string('password hash', PASSWORD_HASH_LENGTH_MAX, 1);
export type PasswordHash = TypeOf<typeof PasswordHash>;

export const User = v.obj('user', {
  id: Id,
  email: Email,
  passwordHash: PasswordHash,
  name: DisplayName,
  avatarUrl: v.opt(AvatarUrl),
});
export type User = TypeOf<typeof User>;
