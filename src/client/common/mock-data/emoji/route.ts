import Router from 'koa-router';
import standardEmojis from './standard.json';

export const listenEmojiService = (router: Router) => {
  // Fetch emoji service descriptor
  router.get('/emojis/standard', ctx => {
    const response = standardEmojis;
    ctx.body = response;
  });
};
