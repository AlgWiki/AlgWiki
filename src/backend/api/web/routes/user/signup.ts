import * as t from 'io-ts';
import { Route } from '../../../../routes/route';
import { ctx } from '../../../../utils';
import { DisplayName, Email, PasswordSubmission } from '../../../../../common/model/user/type';

export const userSignup = new Route(
  t.interface({
    email: Email,
    displayName: DisplayName,
    passwordHashStr: PasswordSubmission,
  }),
  async ({ email, displayName, passwordHashStr }) => {
    ctx.log.info('Hello, world!');
    return {
      id: '123',
      email,
      displayName,
      passwordHashStr,
    };
  },
);
