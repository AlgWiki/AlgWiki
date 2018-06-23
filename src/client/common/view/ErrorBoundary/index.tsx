import { Component, ReactNode } from 'react';

export interface Props {
  children?: ReactNode;
  [prop: string]: any;
}
export interface State {
  error: Error | null;
}
export default class ErrorBoundary extends Component<Props> {
  state = {
    error: null,
  };

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      return 'ERROR';
    }

    return this.props.children;
  }
}
