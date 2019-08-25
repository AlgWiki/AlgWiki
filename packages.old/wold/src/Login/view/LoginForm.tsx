import React, { Component } from 'react';
import Form, { FormFooter } from '@atlaskit/form';
import Button from '@atlaskit/button';

import Config from '../../../config';
import { email, password } from '../../../model/validators/user';
import TextField from './TextField';
import { Footer } from './styled';

export interface Props {}
export default class LoginForm extends Component<Props> {
  onSubmit() {}

  render() {
    return (
      <Form name="login" onSubmit={this.onSubmit}>
        <TextField
          name="email"
          label="Email"
          autoFocus
          isRequired
          fieldValidator={email}
          maxLength={Config.Auth.EMAIL_CHAR_LENGTH_MAX}
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
              Log In
            </Button>
          </FormFooter>
        </Footer>
      </Form>
    );
  }
}
