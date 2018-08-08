import React, { Component } from 'react';
import Modal from '@atlaskit/modal-dialog';
import LoginForm from './view/LoginForm';
import { Footer } from './styled';

export interface Props {
  onClose: () => void;
}
export default class Login extends Component<Props> {
  render() {
    return (
      <Modal heading="Login" footer={Footer} onClose={this.props.onClose} width="small">
        <LoginForm />
      </Modal>
    );
  }
}
