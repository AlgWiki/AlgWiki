import * as t from 'io-ts';
import { Route } from '../../../../routes/route';
import { ctx } from '../../../../utils';

export const userSignup = new Route(
  t.interface({
    name: t.string,
  }),
  async ({ name }) => {
    ctx.log.info('Hello, world!');
    return {
      id: '123',
      name,
    };
  },
);
