import { ConversationResource } from '@atlaskit/conversation';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Conversation, Comment, User } from '@atlaskit/conversation/dist/es5/model';
import { MOCK_USERS } from '../../mocks/conversation';
import { emojiProvider } from '../../mocks/emoji';

const testUser: User = MOCK_USERS[0];

export const conversationResource = new ConversationResource({
  url: '',
  user: testUser,
});

export const dataProviders = new ProviderFactory();
dataProviders.setProvider('emojiProvider', Promise.resolve(emojiProvider));
