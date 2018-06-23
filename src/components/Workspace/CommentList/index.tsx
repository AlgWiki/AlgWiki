import React, { Component } from 'react';
import styled from 'styled-components';
import Comments from '../../Comments';
import { Comment } from '../../../models';

const CommentContainer = styled.div`
  flex: 1;
  overflow: auto;
`;

export interface Props {
  comments: Comment[];
}
export default class CommentList extends React.Component<Props> {
  render() {
    return (
      <CommentContainer>
        <Comments />
      </CommentContainer>
    );
  }
}
