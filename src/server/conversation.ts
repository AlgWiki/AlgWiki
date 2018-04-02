import { Express } from 'express';
import { Conversation, Comment } from '@atlaskit/conversation/dist/es5/model';
import {
  generateMockConversation,
  MOCK_USERS,
  mockContainerId,
  mockConversationId,
} from '../mocks/conversation';

export interface GetConversations {
  values: Conversation[];
}

const mockConversation = generateMockConversation(mockContainerId, mockConversationId);
const allConversations: Conversation[] = [mockConversation];

const generateId = (prefix: string) => `${prefix}-${Math.floor(Math.random() * 1e5).toString(36)}`;

export const listenConversation = (server: Express) => {
  // Fetch conversations associated with a container ID
  server.get('/conversation', (req, res) => {
    const response: GetConversations = {
      values: allConversations.filter(({ containerId }) => containerId === req.query.containerId),
    };
    res.send(response);
  });

  // Create a new conversation with a specified container ID
  server.post('/conversation', (req, res) => {
    const { containerId, comment } = req.body;
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
    res.send(newConversation);
  });

  // Create a new comment
  server.post('/conversation/:conversationId/comment', (req, res) => {
    const { conversationId } = req.params;
    const conversation: Conversation | undefined = allConversations.find(
      ({ conversationId: id }) => id === conversationId,
    );
    if (!conversation) {
      res.status(204);
      res.send('conversation not found');
      return;
    }
    const { parentId, document } = req.body;
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
    res.send(comment);
  });

  // Update an existing comment
  server.put('/conversation/:conversationId/comment/:commentId', (req, res) => {
    const { conversationId, commentId } = req.params;

    const conversation: Conversation | undefined = allConversations.find(
      ({ conversationId: id }) => id === conversationId,
    );
    if (!conversation) {
      res.status(204);
      res.send('conversation not found');
      return;
    }

    const comment: Comment | undefined = conversation.comments!.find(
      ({ commentId: id }) => id === commentId,
    );
    if (!comment) {
      res.status(204);
      res.send('comment not found');
      return;
    }

    const { document: { adf: document } } = req.body;
    comment.document = document;
    res.send(comment);
  });

  // Update an existing comment
  server.delete('/conversation/:conversationId/comment/:commentId', (req, res) => {
    const { conversationId, commentId } = req.params;

    const conversation: Conversation | undefined = allConversations.find(
      ({ conversationId: id }) => id === conversationId,
    );
    if (!conversation) {
      res.send();
      return;
    }

    const comments = conversation.comments;
    if (!comments) {
      res.send();
      return;
    }

    const commentIndex: number | undefined = comments.findIndex(
      ({ commentId: id }) => id === commentId,
    );
    if (commentIndex === -1) {
      res.send();
      return;
    }

    comments.splice(commentIndex, 1);
    res.send();
  });
};
