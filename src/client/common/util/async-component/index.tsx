import React, { ComponentType, Component } from 'react';
import Loadable from 'react-loadable';
import LoadingIndicator from './LoadingIndicator';
import ErrorBoundary from '../../view/ErrorBoundary';

export interface Props {
  [prop: string]: any;
}

export default (loader: () => Promise<{ default: ComponentType<any> }>) => {
  const AsyncComponent = Loadable({
    loader,
    loading: LoadingIndicator,
  });
  return (props: Props) => (
    <ErrorBoundary>
      <AsyncComponent {...props} />
    </ErrorBoundary>
  );
};
