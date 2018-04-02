import React from 'react';

export interface DescriptionProps {
  content: string;
}
export default class Description extends React.Component<DescriptionProps> {
  render() {
    const { content } = this.props;
    return <div>{content}</div>;
  }
}
