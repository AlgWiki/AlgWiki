process.on('uncaughtException', err => {
  console.error('Uncaught error:', err);
});

import path from 'path';

import Koa from 'koa';
// import mount from 'koa-mount';
import serve from 'koa-static';
// import body from 'koa-body';
import Router from 'koa-router';
import sendfile from 'koa-sendfile';
// import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';

// import { ApolloServer, gql } from 'apollo-server';

// import { listenConversation } from './conversation';
// import { listenEmojiService } from '../mocks/emoji/route';
// import { connectDatabase, startTestDatabase } from './db';
// import { graphqlSchema } from './graphql';
// import { isDev } from '../utils/env';

const createWebServer = () => {
  const app = new Koa();

  // Read JSON
  // app.use(body({ enableTypes: ['json'] }));

  // GraphQL
  // app.use(
  //   mount(
  //     '/graphql',
  //     graphqlKoa({
  //       schema: graphqlSchema,
  //     }),
  //   ),
  // );

  // Serve static assets
  const assetsPath = path.resolve(__dirname, '..', 'public');
  app.use(serve(assetsPath));

  // Routes
  const router = new Router();

  // Healthcheck
  router.get('/healthcheck', ctx => {
    ctx.body = 'OK';
  });

  // listenConversation(router);
  // listenEmojiService(router);

  // router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

  router.get('*', async ctx => {
    await sendfile(ctx, path.resolve(assetsPath, 'index.html'));
    if (!ctx.status) ctx.throw(404);
  });

  app.use(router.routes());

  return app;
};

const startWebServer = async (app: Koa, port: number) => {
  await app.listen(port);
  console.log(`🎧  Server listening on port ${port}`);
};

const startServers = async () => {
  // let mongoUri = '';
  // if (isDev()) {
  //   const devDbPort = parseInt(process.env.AW_DEV_DB_PORT || '') || 11038;
  //   mongoUri = await startTestDatabase(devDbPort);
  // }
  // await connectDatabase(mongoUri);

  const app = createWebServer();
  const webServerPort = +(process.env.AW_WEB_PORT || 11037);
  await startWebServer(app, webServerPort);
};

startServers();
