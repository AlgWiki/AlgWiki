import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import { listenConversation } from './conversation';

const server = express();
server.use(bodyParser.json());
server.get('/healthcheck', (req, res) => res.send('OK'));

server.use('/', express.static(path.resolve(__dirname, 'client')));

listenConversation(server);

const html = fs.readFileSync(path.resolve(__dirname, 'client', 'client.html'));
server.get('*', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.send(html);
});

const port = 54321;
server.listen(port, () => console.log(`Server listening on port ${port}`));
