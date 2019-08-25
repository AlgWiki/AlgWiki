import React, { Component } from 'react';
import Modal from '@atlaskit/modal-dialog';
import LoginForm from './view/LoginForm';
import { Footer } from './styled';
import SignupForm from './view/SignupForm';

export enum Mode {
  Login,
  Signup,
}

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
        {mode === Mode.Login ? <LoginForm /> : <SignupForm />}
      </Modal>
    );
  }
}
