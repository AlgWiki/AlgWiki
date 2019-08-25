import 'reflect-metadata';

import getPort from 'get-port';
import { DEFAULT_PORT as WEB_DEFAULT_PORT } from 'common/dist/config/web/server';
import { createWebServer } from './app';

const getConfig = async () => {
  let webPort = process.env.PORT ? +process.env.PORT : WEB_DEFAULT_PORT;
  if (process.env.NODE_ENV !== 'production') {
    const initialPort = webPort;
    webPort = await getPort({ port: initialPort });
    if (webPort !== initialPort) {
      console.warn(`Initial port ${initialPort} is not available. Using ${webPort} instead...`);
    }
  }
  return {
    web: {
      port: webPort,
    },
  };
};

const startServers = async () => {
  const config = await getConfig();
  // await connectDatabase(config.db.host, config.db.port);

  const app = await createWebServer();
  await app.listen(config.web.port);
  console.log(`🎧  Server listening on port ${config.web.port}`);
};

startServers();
