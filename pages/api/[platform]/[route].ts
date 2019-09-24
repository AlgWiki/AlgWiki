/**
 * This file is only used during dev.
 * Production routes are generated using Pulumi.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import chalk from 'chalk';
import pino from 'pino';

import { runWithCtx } from '../../../src/backend/utils';
import { Api } from '../../../src/backend/routes/api';
import * as backendApis from '../../../src/backend/api';

const apis: { [platform: string]: Api } = backendApis;

const baseLoggerDev = pino({ base: null, prettyPrint: { translateTime: 'HH:MM:ss.l' } });

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(chalk.blue('Request:'), req.url, req.body);
  const api = apis[req.query.platform as string];
  if (!api) {
    res.status(404).json({ err: 'platform not found' });
    return;
  }
  const route = api.routes[req.query.route as string];
  if (!route) {
    res.status(404).json({ err: 'route not found' });
    return;
  }

  try {
    await runWithCtx(
      {
        log: baseLoggerDev.child({
          route: req.query.route,
          url: req.url,
        }),
      },
      async () => {
        const resBody = await route.run(req.body);
        res.status(200).json(resBody);
        console.log(chalk.green('Response:'), resBody);
      },
    );
  } catch (err) {
    console.error(chalk.red('Error:'), err);
    const { status = 500, body = { err: String(err) } } = err || {};
    res.status(status).json(body);
  }
};
