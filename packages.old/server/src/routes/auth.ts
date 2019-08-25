import Router from 'koa-router';
import passport from 'koa-passport';

export default (router: Router) => {
  router.post('/signup', (ctx, next) =>
    passport.authenticate('local', (err, user, info, status) => {
      if (!user) {
        ctx.body = { success: false };
        ctx.throw(401);
        return;
      }

      ctx.body = { success: true };
      return ctx.login(user);
    })(ctx, next),
  );

  router.post('/login', ctx => {});
};
