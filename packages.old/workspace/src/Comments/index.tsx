import React, { Component } from 'react';

import { Container } from './styled';
import { Comment, User } from 'common/dist/model';
import Conversation from '@atlaskit/conversation/dist/es2015/components/Conversation';

export interface Props {
  comments: Comment[];
  user?: User;
}

/**
 * Displays user comments for a problem.
 */
export default class Comments extends Component<Props> {
  render() {
    const user = this.props.user && {
      id: this.props.user.id,
      name: this.props.user.name,
      avatarUrl: this.props.user.avatarUrl,
    };
    return (
      <Container>
        <Conversation
          containerId="container-id-123"
          user={user}
          createAnalyticsEvent={() => ({ update() {}, fire() {}, attributes: {} })}
          sendAnalyticsEvent={() => {}}
        />
      </Container>
    );
  }
}
