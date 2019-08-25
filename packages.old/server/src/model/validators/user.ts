import { length } from 'stringz';
import utf8Length from 'utf8-byte-length';
import Config from '../../config';
import { maxUtf8Length } from '../../util/string';

export interface Validator<T> {
  validate: (arg: T) => boolean;

  /** Message to display to the user if the validator fails on their input. */
  message?: string;
}

export class FieldValidator<T> {
  constructor(public validators: Validator<T>[]) {}

  /** Returns `true` on success or `false` if one or more validators fail. */
  validate = (value: T): boolean => this.validators.every(({ validate }) => validate(value));
}

export const email = new FieldValidator<string>([
  {
    // Regex from: https://www.regular-expressions.info/email.html
    // NOTE: May fail some crazy-yet-valid emails (though I believe catching mistakes is more important)
    validate: email => email.length === 0 || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email),
    message: 'Email is invalid',
  },
  {
    validate: email => email.length > 0,
    message: `Email is required`,
  },
  {
    validate: email => length(email) <= Config.Auth.EMAIL_CHAR_LENGTH_MAX,
    message: `Email cannot be more than ${Config.Auth.EMAIL_CHAR_LENGTH_MAX} characters long`,
  },
  {
    validate: email => utf8Length(email) <= maxUtf8Length(Config.Auth.EMAIL_UTF8_LENGTH_MAX),
    message: `Email cannot be more than ${Config.Auth.EMAIL_UTF8_LENGTH_MAX} UTF-8 bytes long`,
  },
]);

export const displayName = new FieldValidator<string>([
  // TODO: Can we block invalid unicode strings?
  //       (like lone skin tone modifiers, ANSI chars, etc.)
  // {
  //   validate: displayName => !/\p{C}/u.test(displayName),
  //   message: 'Display name must only contain printable characters',
  // },
  {
    validate: displayName => length(displayName) >= Config.Auth.DISPLAY_NAME_CHAR_LENGTH_MIN,
    message: `Display name must be ${
      Config.Auth.DISPLAY_NAME_CHAR_LENGTH_MIN
    } or more characters long`,
  },
  {
    validate: displayName => length(displayName) <= Config.Auth.DISPLAY_NAME_CHAR_LENGTH_MAX,
    message: `Display name cannot be more than ${
      Config.Auth.DISPLAY_NAME_CHAR_LENGTH_MAX
    } characters long`,
  },
  {
    validate: displayName =>
      utf8Length(displayName) <= maxUtf8Length(Config.Auth.DISPLAY_NAME_UTF8_LENGTH_MAX),
    message: `Display name cannot be more than ${
      Config.Auth.DISPLAY_NAME_UTF8_LENGTH_MAX
    } UTF-8 bytes long`,
  },
]);

export const password = new FieldValidator<string>([
  {
    validate: password => length(password) >= Config.Auth.PASSWORD_CHAR_LENGTH_MIN,
    message: `Password must be ${Config.Auth.PASSWORD_CHAR_LENGTH_MIN} or more characters long`,
  },
  {
    validate: password => length(password) <= Config.Auth.PASSWORD_CHAR_LENGTH_MAX,
    message: `Password cannot be more than ${Config.Auth.PASSWORD_CHAR_LENGTH_MAX} characters long`,
  },
]);

export const passwordHash = new FieldValidator<string>([
  { validate: hash => hash.length > 0 },
  { validate: hash => hash.length < 200 },
]);
