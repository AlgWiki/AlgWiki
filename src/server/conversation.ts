import { Conversation, Comment } from '@atlaskit/conversation/dist/es5/model';
import {
  generateMockConversation,
  MOCK_USERS,
  mockContainerId,
  mockConversationId,
} from '../mocks/conversation';
import Router from 'koa-router';

export interface GetConversations {
  values: Conversation[];
}

const mockConversation = generateMockConversation(mockContainerId, mockConversationId);
const allConversations: Conversation[] = [mockConversation];

const generateId = (prefix: string) => `${prefix}-${Math.floor(Math.random() * 1e5).toString(36)}`;

export const listenConversation = (router: Router) => {
  // Fetch conversations associated with a container ID
  router.get('/conversation', ctx => {
    const response: GetConversations = {
      values: allConversations.filter(({ containerId }) => containerId === ctx.query.containerId),
    };
    ctx.body = response;
  });

  // Create a new conversation with a specified container ID
  router.post('/conversation', ctx => {
    const { containerId, comment } = (ctx.request as any).body;
    const newConversation: Conversation = {
      containerId,
      conversationId: generateId('conversation-id'),
      meta: {},
      comments: [],
    };
    if (comment) {
      newConversation.comments!.push({
        commentId: generateId('comment-id'),
        conversationId: newConversation.conversationId,
        createdAt: Date.now(),
        createdBy: MOCK_USERS[0],
        ...comment,
      });
    }
    ctx.body = newConversation;
  });

  // Create a new comment
  router.post('/conversation/:conversationId/comment', ctx => {
    const { conversationId } = ctx.params;
    const conversation: Conversation | undefined = allConversations.find(
      ({ conversationId: id }) => id === conversationId,
    );
    if (!conversation) {
      ctx.status = 204;
      ctx.body = 'conversation not found';
      return;
    }
    const { parentId, document } = (ctx.request as any).body;
    const comment: Comment = {
      commentId: generateId('comment-id'),
      conversationId,
      parentId,
      document,
      createdAt: Date.now(),
      createdBy: MOCK_USERS[0],
    };
    if (!conversation.comments) conversation.comments = [];
    conversation.comments.push(comment);
    ctx.body = comment;
  });

  // Update an existing comment
  router.put('/conversation/:conversationId/comment/:commentId', ctx => {
    const { conversationId, commentId } = ctx.params;

    const conversation: Conversation | undefined = allConversations.find(
      ({ conversationId: id }) => id === conversationId,
    );
    if (!conversation) {
      ctx.status = 204;
      ctx.body = 'conversation not found';
      return;
    }

    const comment: Comment | undefined = conversation.comments!.find(
      ({ commentId: id }) => id === commentId,
    );
    if (!comment) {
      ctx.status = 204;
      ctx.body = 'comment not found';
      return;
    }

    const { document: { adf: document } } = (ctx.request as any).body;
    comment.document = document;
    ctx.body = comment;
  });

  // Update an existing comment
  router.delete('/conversation/:conversationId/comment/:commentId', ctx => {
    const { conversationId, commentId } = ctx.params;

    const conversation: Conversation | undefined = allConversations.find(
      ({ conversationId: id }) => id === conversationId,
    );
    if (!conversation) {
      return;
    }

    const comments = conversation.comments;
    if (!comments) {
      return;
    }

    const commentIndex: number | undefined = comments.findIndex(
      ({ commentId: id }) => id === commentId,
    );
    if (commentIndex === -1) {
      return;
    }

    comments.splice(commentIndex, 1);
  });
};
