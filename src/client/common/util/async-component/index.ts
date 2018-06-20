import { ComponentType } from 'react';
import Loadable from 'react-loadable';
import LoadingIndicator from './LoadingIndicator';

export default (loader: () => Promise<{ default: ComponentType }>) =>
  Loadable({
    loader,
    loading: LoadingIndicator,
  });
