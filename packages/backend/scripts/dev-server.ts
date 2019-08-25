import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import chalk from 'chalk';
import pino from 'pino';
import { runWithCtx } from '../src/utils';
import { Api } from '../src/routes/api';
import * as apis from '../src/api';

const baseLoggerDev = pino({ base: null, prettyPrint: { translateTime: 'HH:MM:ss.l' } });

export class NotFoundError extends Error {
  status = 404;
}
export class ServerError extends Error {
  status = 500;
}

export const createApiRouter = (platform: string, api: Api) =>
  new Router().post(`/api/${platform}/:route`, async ctx => {
    console.log(chalk.blue('Request:'), ctx.url, ctx.request.body);
    const route = api.routes[ctx.params.route];
    if (!route) throw new NotFoundError('Route not found');
    try {
      await runWithCtx(
        {
          log: baseLoggerDev.child({
            route: ctx.params.route,
            url: ctx.url,
          }),
        },
        async () => {
          ctx.body = await route.run(ctx.request.body);
          console.log(chalk.green('Response:'), ctx.body);
        },
      );
    } catch (err) {
      console.error(chalk.red('Error:'), err);
      ctx.body = { err: err };
      throw new ServerError();
    }
  });

export const createApiServer = () => {
  const server = new Koa().use(bodyParser());
  for (const [platform, api] of Object.entries(apis)) {
    const router = createApiRouter(platform, api);
    server.use(router.routes()).use(router.allowedMethods());
  }
  return server;
};

export const main = () => {
  const port = Number(process.env.PORT || 11037);
  const server = createApiServer();
  server.listen(port);
};

if (require.main === module) main();
