process.on('uncaughtException', err => {
  console.error('Uncaught error:', err);
});

import path from 'path';

import Koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import body from 'koa-body';
import Router from 'koa-router';
import sendfile from 'koa-sendfile';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';

import { ApolloServer, gql } from 'apollo-server';

import { listenConversation } from './conversation';
import { listenEmojiService } from '../mocks/emoji/route';
import { connectDatabase, startTestDatabase } from './db';
import { graphqlSchema } from './graphql';
import { isDev } from '../utils/env';

const createWebServer = () => {
  const app = new Koa();

  // Read JSON
  app.use(body({ enableTypes: ['json'] }));

  // Serve static assets
  app.use(mount('/', serve(path.resolve(__dirname, 'client'))));

  // Healthcheck
  app.use(
    mount('/healthcheck', ctx => {
      ctx.body = 'OK';
    }),
  );

  // GraphQL
  app.use(
    mount(
      '/graphql',
      graphqlKoa({
        schema: graphqlSchema,
      }),
    ),
  );

  // Routes
  const router = new Router();

  listenConversation(router);
  listenEmojiService(router);

  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

  router.get('*', async ctx => {
    await sendfile(ctx, path.resolve(__dirname, 'client', 'client.html'));
    if (!ctx.status) ctx.throw(404);
  });

  app.use(router.routes());

  return app;
};

const startWebServer = async (app: Koa, port: number) => {
  await app.listen(port);
  console.log(`Server listening on port ${port}`);
};

const startServers = async () => {
  let mongoUri = '';
  if (isDev()) {
    const devDbPort = parseInt(process.env.EC_DEV_DB_PORT || '') || 36364;
    mongoUri = await startTestDatabase(devDbPort);
  }
  await connectDatabase(mongoUri);

  const app = createWebServer();
  const webServerPort = parseInt(process.env.EC_WEB_PORT || '') || 36363;
  await startWebServer(app, webServerPort);
};

startServers();
