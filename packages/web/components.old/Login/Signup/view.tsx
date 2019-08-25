import React from 'react';
import Form, { FormFooter } from '@atlaskit/form';
import Button from '@atlaskit/button';
import InlineMessage from '@atlaskit/inline-message';
import zxcvbn from 'zxcvbn';
import * as t from 'io-ts';

import {
  EMAIL_LENGTH_MAX,
  PASSWORD_LENGTH_MAX,
  DISPLAY_NAME_LENGTH_MAX,
  PASSWORD_MIN_SCORE,
} from 'common/dist/config/model/common';
import { Email, Password, DisplayName } from 'common/dist/model/user/type';
import TextField from '../common/TextField';
import { ErrorMessage } from '../common/styled';

export interface SignupFormProps {
  onSubmit: (data: { [name: string]: string }) => void;
  isSubmitting: boolean;
  errorMessage?: string;
  initialValues?: Partial<{
    email: string;
    displayname: string;
    password: string;
    passwordConfirm: string;
  }>;
}
export const SignupForm = ({
  onSubmit,
  isSubmitting,
  errorMessage,
  initialValues = {},
}: SignupFormProps) => (
  // TODO: Simulate TAB on ENTER inside text fields
  <Form name="signup" onSubmit={onSubmit}>
    {({ formProps }: any) => (
      <form {...formProps}>
        <TextField
          name="email"
          label="Email"
          autoFocus
          isRequired
          type={Email}
          maxLength={EMAIL_LENGTH_MAX}
          isDisabled={isSubmitting}
          defaultValue={initialValues.email || ''}
        />
        <TextField
          name="displayname"
          label="Display Name"
          isRequired
          type={DisplayName}
          maxLength={DISPLAY_NAME_LENGTH_MAX}
          isDisabled={isSubmitting}
          defaultValue={initialValues.displayname || ''}
        />
        <TextField
          name="password"
          label="Password"
          fieldType="password"
          isRequired
          type={Password}
          maxLength={PASSWORD_LENGTH_MAX}
          isDisabled={isSubmitting}
          defaultValue={initialValues.password || ''}
          validate={str => {
            const strength = zxcvbn(str.substring(0, 100));
            if (strength.score < PASSWORD_MIN_SCORE) {
              if (strength.feedback && strength.feedback.warning) {
                return strength.feedback.warning;
              }
              return 'Weak password';
            }
            return undefined;
          }}
        />
        <TextField
          name="password-confirm"
          label="Confirm Password"
          fieldType="password"
          isRequired
          type={t.string}
          maxLength={PASSWORD_LENGTH_MAX}
          isDisabled={isSubmitting}
          defaultValue={initialValues.passwordConfirm || ''}
          validate={str => {
            const passwordEl = document.getElementsByName('password')[0] as HTMLInputElement;
            if (passwordEl && str !== passwordEl.value) return 'Password does not match';
            return undefined;
          }}
        />
        <FormFooter>
          {errorMessage && (
            <ErrorMessage>
              <InlineMessage type="error" title="Failed to sign-up">
                {errorMessage}
              </InlineMessage>
            </ErrorMessage>
          )}
          <Button type="submit" appearance="primary" isLoading={isSubmitting}>
            Sign Up
          </Button>
        </FormFooter>
      </form>
    )}
  </Form>
);
