import React, { Component } from 'react';
import CommentComponent, {
  CommentAuthor,
  CommentAction,
  CommentTime,
} from '@atlaskit/comment';
import Avatar from '@atlaskit/avatar';
import { Comment } from '../../../models';

export const renderComment = ({ user, text, submitDate }: Comment) =>
  <CommentComponent
    avatar={<Avatar src={user.avatarURL} label={user.name} size="medium" />}
    author={<CommentAuthor>{user.name}</CommentAuthor>}
    type="Author"
    time={<CommentTime>{submitDate}</CommentTime>}
    content={<div>{text}</div>}
    actions={[
      <CommentAction>Reply</CommentAction>,
      <CommentAction>Edit</CommentAction>,
      <CommentAction>Like</CommentAction>,
    ]}
  />;

export interface CommentListProps {
  comments: Comment[];
}
export default class CommentList extends Component {
  render() {
    const { comments } = this.props;
    const commentList = comments.map((comment: Comment, i: number) => {
      return <li key={i}>{renderComment(comment)}</li>;
    });
    return <ul>{commentList}</ul>;
  }
}
