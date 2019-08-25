import http from 'http';
import { parse } from 'url';
import chalk from 'chalk';
import next from 'next';
import { createApiServer } from '../packages/backend/scripts/dev-server';

// Next.js modifies the tsconfig of the current directory 😒
// This is a workaround to stop it breaking our tsconfig files
process.chdir('./packages/web');

export const createWebServer = () => next({ dev: true });

export const createServer = () => {
  const apiServer = createApiServer();
  const apiServerReqHandler = apiServer.callback();
  const webServer = createWebServer();
  webServer.prepare(); // start preparing in the background
  const webServerReqHandler = webServer.getRequestHandler();

  return http.createServer((req, res) => {
    const { pathname = '' } = parse(req.url || '');
    const pathRoot = pathname.split('/')[1];
    if (pathRoot === 'api') {
      apiServerReqHandler(req, res);
    } else {
      webServerReqHandler(req, res);
    }
  });
};

export const listenServer = (app: http.Server, port: number) =>
  new Promise<http.Server>((resolve, reject) => {
    app.listen(port, (err: any) => {
      if (err) reject(err);
      else {
        console.log(chalk.green(`Dev server started on port ${port}!`));
        resolve(app);
      }
    });
  });

export const main = async () => {
  const server = createServer();

  const port = Number(process.env.PORT || 11037);
  return await listenServer(server, port);
};

if (require.main === module) main();
