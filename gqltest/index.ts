const Koa = require('koa');
const body = require('koa-bodyparser');
const Router = require('koa-router');
const { gql, makeExecutableSchema } = require('apollo-server');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

const schema = makeExecutableSchema({
  typeDefs: gql`
    type Query {
      hello: String
    }
  `,
  resolvers: {
    Query: {
      hello: (root, args, context) => {
        return 'Hello world!';
      },
    },
  },
});

const createWebServer = () => {
  const app = new Koa();
  app.use(body({ enableTypes: ['json'] }));
  const router = new Router();
  router.get('/graphql', graphqlKoa({ schema }));
  router.post('/graphql', graphqlKoa({ schema }));
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));
  app.use(router.routes());
  app.use(router.allowedMethods());
  return app;
};

const startServers = () => {
  const app = createWebServer();
  const webServerPort = +(process.env.AW_WEB_PORT || 11037);
  app.listen(webServerPort);
  console.log(`🎧  Server listening on port ${webServerPort}`);
};

startServers();
