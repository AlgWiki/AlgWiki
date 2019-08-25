// import { Comment, Conversation } from '@atlaskit/conversation/dist/es5/model';
// import { uuid } from '@atlaskit/conversation/dist/es5/internal/uuid';
// import { User } from '../model';

// export const MESSAGES: string[] = [
//   'Awesome challenge!',
//   'Help! My code works locally but not here!',
//   'Ugh, not another math challenge...',
//   'Do I need to use DP for this?',
//   'Solved it using recursion.',
// ];

// export const mockComment: Comment = {
//   localId: 'mock-comment-1-local',
//   commentId: 'mock-comment-1',
//   conversationId: 'mock-conversation',
//   createdBy: MOCK_USERS[0],
//   createdAt: Date.now(),
//   document: {
//     adf: {
//       version: 1,
//       type: 'doc',
//       content: [
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text: 'Hello World',
//             },
//           ],
//         },
//       ],
//     },
//   },
// };

// export const mockComment2: Comment = {
//   localId: 'mock-comment-2-local',
//   commentId: 'mock-comment-2',
//   conversationId: 'mock-conversation',
//   createdBy: MOCK_USERS[0],
//   createdAt: Date.now(),
//   document: {
//     adf: {
//       version: 1,
//       type: 'doc',
//       content: [
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text: 'Hello World',
//             },
//           ],
//         },
//       ],
//     },
//   },
// };

// export const mockInlineComment: Comment = {
//   localId: 'mock-inline-comment-local',
//   commentId: 'mock-inline-comment',
//   conversationId: 'mock-inline-conversation',
//   createdBy: MOCK_USERS[0],
//   createdAt: Date.now(),
//   document: {
//     adf: {
//       version: 1,
//       type: 'doc',
//       content: [
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text: 'Maybe you should actually do something here?',
//             },
//           ],
//         },
//       ],
//     },
//   },
// };

// export const mockReplyComment: Comment = {
//   commentId: 'mock-reply-comment-1',
//   parentId: 'mock-comment-1',
//   conversationId: 'mock-conversation',
//   createdBy: MOCK_USERS[1],
//   createdAt: Date.now(),
//   document: {
//     adf: {
//       version: 1,
//       type: 'doc',
//       content: [
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text: 'Reply!',
//             },
//           ],
//         },
//       ],
//     },
//   },
// };

// export const mockContainerId = 'mock-container-id';
// export const mockConversationId = 'mock-conversation-id';

// export const mockConversation: Conversation = {
//   conversationId: 'mock-conversation',
//   containerId: mockContainerId,
//   comments: [mockComment, mockReplyComment],
//   meta: {},
//   localId: 'local-conversation',
// };

// export const mockInlineConversation: Conversation = {
//   conversationId: 'mock-inline-conversation',
//   containerId: mockContainerId,
//   comments: [mockInlineComment],
//   meta: { name: 'main.js', lineNumber: 3 },
// };

// export const generateMockConversation = (
//   containerId: string = mockContainerId,
//   conversationId: string = mockConversationId,
// ): Conversation => ({
//   meta: {},
//   conversationId,
//   containerId,
//   comments: [...Array(3)].map(() => {
//     const commentId = <string>uuid.generate();

//     return {
//       localId: `${commentId}-local`,
//       commentId: commentId,
//       conversationId,
//       createdBy: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)],
//       createdAt: Date.now(),
//       document: {
//         adf: {
//           version: 1,
//           type: 'doc',
//           content: [
//             {
//               type: 'paragraph',
//               content: [
//                 {
//                   type: 'text',
//                   text: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
//                 },
//               ],
//             },
//           ],
//         },
//       },
//     };
//   }),
// });
