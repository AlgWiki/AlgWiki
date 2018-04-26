import { Express } from 'express';
import standardEmojis from './standard.json';

export const listenEmojiService = (server: Express) => {
  // Fetch emoji service descriptor
  server.get('/emojis/standard', (req, res) => {
    const response = standardEmojis;
    res.send(response);
  });
};
