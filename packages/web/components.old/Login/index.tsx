import React, { Component } from 'react';
import Modal from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';
import dynamic from 'next/dynamic';
import { Footer, LoadingContiainer } from './common/styled';
import { Mode } from './types';

export const LoadingSpinner = () => (
  <LoadingContiainer>
    <Spinner size="large" />
  </LoadingContiainer>
);

export const LoginForm = dynamic({
  loader: () => import('./forms').then(mod => mod.Login),
  loading: () => <LoadingSpinner />,
});

export const Signup = dynamic({
  loader: () => import('./forms').then(mod => mod.Signup),
  loading: () => <LoadingSpinner />,
});

export interface Props {
  mode?: Mode;
  onClose: () => void;
}
export default class Login extends Component<Props> {
  static defaultProps = {
    mode: Mode.Login,
  };

  render() {
    const { mode } = this.props;
    return (
      <Modal
        heading={mode === Mode.Login ? 'Login' : 'Sign Up'}
        footer={Footer}
        onClose={this.props.onClose}
        width="small"
      >
        {mode === Mode.Login ? <LoginForm /> : <Signup />}
      </Modal>
    );
  }
}
