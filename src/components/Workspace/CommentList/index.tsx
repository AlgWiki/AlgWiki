import React, { Component } from 'react';
import styled from 'styled-components';
import Comments from '../../Comments';

const CommentContainer = styled.div`
  flex: 1;
`;

export interface CommentListProps {}

export default class CommentList extends React.Component<CommentListProps> {
  render() {
    return (
      <CommentContainer>
        <Comments />
      </CommentContainer>
    );
  }
}
