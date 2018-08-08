import passport from 'koa-passport';
import { Strategy as LocalStrategy, IStrategyOptions } from 'passport-local';
import argon2, { argon2id } from 'argon2';

import userModel, { UserModel } from '../db/models/user';

passport.serializeUser<UserModel, string>((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser<UserModel, string>((id, done) => {
  userModel.findById(id, done);
});

const options: IStrategyOptions = {};
passport.use(
  new LocalStrategy(options, async (username, password, done) => {
    const user = await userModel.findOne({ username });
    if (!user) return done(null, false);
    if ((await hash(password)) !== password) return done(null, false);
    return done(null, user);
  }),
);

export const hash = (password: string): Promise<string> =>
  argon2.hash(password, {
    // TODO: Review these settings once hosted on a server
    type: argon2id,
    timeCost: 2,
    memoryCost: 16,
    parallelism: 1,
  });
export const verifyHash = (hash: string, password: string): Promise<boolean> =>
  argon2.verify(hash, password);
