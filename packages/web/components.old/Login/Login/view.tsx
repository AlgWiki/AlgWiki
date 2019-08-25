import React from 'react';
import Form, { FormFooter } from '@atlaskit/form';
import Button from '@atlaskit/button';

import { EMAIL_LENGTH_MAX, PASSWORD_LENGTH_MAX } from 'common/dist/config/model/common';
import { Email, Password } from 'common/dist/model/user/type';
import TextField from '../common/TextField';
import { Footer } from '../view/styled';

export interface LoginFormProps {
  onSubmit: (data: { [name: string]: string }) => void;
  isSubmitting: boolean;
}
export const LoginForm = ({ onSubmit, isSubmitting }: LoginFormProps) => (
  <Form name="login" onSubmit={onSubmit}>
    {({ formProps }: any) => (
      <form {...formProps}>
        <TextField
          name="email"
          label="Email"
          autoFocus
          isRequired
          type={Email}
          maxLength={EMAIL_LENGTH_MAX}
        />
        <TextField
          name="password"
          label="Password"
          fieldType="password"
          isRequired
          type={Password}
          maxLength={PASSWORD_LENGTH_MAX}
        />
        <Footer>
          <FormFooter>
            <Button type="submit" appearance="primary" isLoading={isSubmitting}>
              Log In
            </Button>
          </FormFooter>
        </Footer>
      </form>
    )}
  </Form>
);
