import React, { ComponentType, Component } from 'react';
import Loadable, { LoadingComponentProps } from 'react-loadable';
import LoadingIndicator from './LoadingIndicator';
import ErrorBoundary from '../../view/ErrorBoundary';

export default function<P>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  loading: ComponentType<LoadingComponentProps> | null = LoadingIndicator,
) {
  const LoadableComponent = Loadable({
    loader,
    loading: loading || (() => null),
  });

  return class AsyncComponent extends Component<P> {
    static preload() {
      LoadableComponent.preload();
    }

    render() {
      return (
        <ErrorBoundary>
          <LoadableComponent {...this.props} />
        </ErrorBoundary>
      );
    }
  };
}
