import { EmojiResource } from '@atlaskit/emoji';

export const emojiProvider = new EmojiResource({
  providers: [{ url: '/emojis/standard' }],
});
