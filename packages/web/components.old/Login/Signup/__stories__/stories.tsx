import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import '@atlaskit/css-reset';

import Modal from '@atlaskit/modal-dialog';
import { SignupForm, SignupFormProps } from '../view';
import { Footer } from '../../common/styled';

const prefillValues: SignupFormProps['initialValues'] = {
  email: 'someone@somewhere.com',
  displayname: 'Mr. Someone',
  password: 'this is a password',
  passwordConfirm: 'this is a password',
};

type FormProps = Partial<SignupFormProps>;
class Form extends Component<FormProps> {
  state: { isSubmitting: boolean };

  constructor(props: FormProps) {
    super(props);
    this.state = {
      isSubmitting: props.isSubmitting || false,
    };
  }

  render() {
    return (
      <Modal heading="Sign Up" footer={Footer} width="small">
        <SignupForm
          onSubmit={(...args: any[]) => {
            action('onSubmit')(...args);
            this.setState({ isSubmitting: true });
            setTimeout(() => {
              this.setState({ isSubmitting: false });
            }, 5000);
          }}
          {...this.props}
          isSubmitting={this.state.isSubmitting}
        />
      </Modal>
    );
  }
}

storiesOf('SignupForm', module)
  .add('basic', () => <Form />)
  .add('prefilled', () => <Form initialValues={prefillValues} />)
  .add('submitting', () => <Form initialValues={prefillValues} isSubmitting />)
  .add('error', () => <Form errorMessage="Something happened." />);
