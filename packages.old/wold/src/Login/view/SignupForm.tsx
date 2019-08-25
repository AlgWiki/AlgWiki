import React, { Component } from 'react';
import Form, { FormFooter } from '@atlaskit/form';
import Button from '@atlaskit/button';

import Config from '../../../config';
import { email, displayName, password } from '../../../model/validators/user';
import TextField from './TextField';
import { Footer } from './styled';

export interface Props {}
export default class SignupForm extends Component<Props> {
  onSubmit() {}

  render() {
    return (
      // TODO: Update usage of forms once it becomes stable
      // TODO: Simulate TAB on ENTER inside text fields
      <Form name="signup" onSubmit={this.onSubmit}>
        <TextField
          name="email"
          label="Email"
          autoFocus
          isRequired
          fieldValidator={email}
          maxLength={Config.Auth.EMAIL_CHAR_LENGTH_MAX}
        />
        <TextField
          name="display-name"
          label="Display Name"
          isRequired
          fieldValidator={displayName}
          maxLength={Config.Auth.DISPLAY_NAME_CHAR_LENGTH_MAX}
        />
        <TextField
          name="password"
          label="Password"
          isRequired
          fieldValidator={password}
          maxLength={Config.Auth.PASSWORD_CHAR_LENGTH_MAX}
        />
        <Footer>
          <FormFooter>
            <Button type="submit" appearance="primary">
              Sign Up
            </Button>
          </FormFooter>
        </Footer>
      </Form>
    );
  }
}
