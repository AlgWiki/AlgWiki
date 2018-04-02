import { ConversationResource } from '@atlaskit/conversation';
import { Conversation, Comment, User } from '@atlaskit/conversation/dist/es5/model';
import { MOCK_USERS } from '../../mocks/conversation';

const testUser: User = MOCK_USERS[0];

export const conversationResource = new ConversationResource({
  url: '',
  user: testUser,
});
