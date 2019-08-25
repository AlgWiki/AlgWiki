import React, { Component } from 'react';

import { Container } from './styled';
import { Comment } from '../../../common/model';

export interface Props {
  comments: Comment[];
}
export default class Comments extends Component<Props> {
  render() {
    return (
      <Container>
        <span>COMMENTS</span>
      </Container>
    );
  }
}
