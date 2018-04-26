import React, { Component } from 'react';
import { Conversation } from '@atlaskit/conversation';
import { conversationResource, dataProviders } from './providers';
import { mockContainerId, mockConversationId } from '../../mocks/conversation';

export default class Comments extends React.Component {
  componentDidMount() {
    conversationResource.getConversations(mockContainerId);
  }

  render() {
    return (
      <Conversation
        id={mockConversationId}
        containerId={mockContainerId}
        provider={conversationResource}
        dataProviders={dataProviders}
      />
    );
  }
}
