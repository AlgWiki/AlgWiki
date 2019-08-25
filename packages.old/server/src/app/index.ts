// import path from 'path';
import Koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import body from 'koa-bodyparser';
import Router from 'koa-router';
// import sendfile from 'koa-sendfile';
// import session from 'koa-session';
// import passport from 'koa-passport';
// import { isDev } from './client/common/util/env';
import { ApolloServer } from 'apollo-server-koa';
import gql from 'graphql-tag';
import fse from 'fs-extra';
import next from 'next';
import path from 'path';
import { resolvers } from 'common/src/graphql/resolvers';
// import { RecipeResolver } from '../graphql/recipe/resolver';

// import { ApolloServer, gql } from 'apollo-server';

// import { listenConversation } from './conversation';
// import { listenEmojiService } from '../mocks/emoji/route';
// import initAuthRoutes from '../routes/auth';
import { getDbConnection } from '../db/connect';
// import { schema as graphqlSchema } from '../graphql';
// import '../auth';
// import config from '../config';

export const createWebServer = async () => {
  const db = getDbConnection();

  const app = new Koa();

  // Read JSON requests
  app.use(
    body({
      enableTypes: ['json'],
    }),
  );

  // Sessions
  // app.keys = ['super-secret-key'];
  // app.use(session(app));

  // Authentication
  // app.use(passport.initialize());
  // app.use(passport.session());

  // Serve static assets
  // const assetsPath = path.resolve(__dirname, '..', 'public');
  // app.use(serve(assetsPath));

  // Routes
  const router = new Router();

  // Healthcheck
  router.get('/healthcheck', ctx => {
    ctx.body = 'OK';
  });

  // listenConversation(router);
  // listenEmojiService(router);
  // initAuthRoutes(router);

  // GraphQL
  const schema = await fse.readFile(
    path.resolve(__dirname, '..', '..', '..', 'common', 'src', 'graphql', 'schema.gql'),
    'utf8',
  );
  const server = new ApolloServer({
    typeDefs: gql`
      ${schema}
    `,
    resolvers,
  });
  server.applyMiddleware({ app });

  // router.get('/graphql', graphqlKoa({ schema: graphqlSchema }));
  // router.post('/graphql', graphqlKoa({ schema: graphqlSchema }));
  // router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

  // Next
  const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
    dir: path.resolve(__dirname, '..', '..', '..', 'web'),
  });
  const nextHandler = nextApp.getRequestHandler();
  await nextApp.prepare();
  router.get('*', async ctx => {
    nextHandler(ctx.req, ctx.res);
    ctx.respond = false;
  });

  // Monaco editor
  // const nodeModulesPath = path.resolve(__dirname, '..', '..', '..', '..', 'node_modules');
  // app.use(
  //   mount(
  //     '/monaco-editor',
  //     serve(path.join(nodeModulesPath, '@timkendrick', 'monaco-editor', 'dist', 'external')),
  //   ),
  // );

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};
