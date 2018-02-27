import React, { Component } from 'react';

export interface DescriptionProps {
  content: string;
}
export default class Description extends Component {
  render() {
    const { content } = this.props;
    return <div>{content}</div>;
  }
}
