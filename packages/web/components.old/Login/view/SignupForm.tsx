import React, { Component } from 'react';
import Form, { FormFooter } from '@atlaskit/form';
import Button from '@atlaskit/button';
import zxcvbn from 'zxcvbn';
import * as t from 'io-ts';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import {
  EMAIL_LENGTH_MAX,
  PASSWORD_LENGTH_MAX,
  DISPLAY_NAME_LENGTH_MAX,
  PASSWORD_MIN_SCORE,
} from 'common/dist/config/model/common';
import { Email, Password, DisplayName } from 'common/dist/model/user/type';
import TextField from '../common/TextField';
import { Footer } from './styled';

const USER_SIGNUP = gql`
  mutation UserSignup($user: UserSignupInput!) {
    userSignup(user: $user) {
      id
      displayName
      passwordHash
      email
    }
  }
`;

export default class SignupForm extends Component {
  render() {
    // TODO: Simulate TAB on ENTER inside text fields
    return (
      <Mutation mutation={USER_SIGNUP}>
        {(userSignup, { loading: isSubmitting, error }) => (
          <Form
            name="signup"
            onSubmit={(data: { [name: string]: string }) =>
              userSignup({
                variables: {
                  user: {
                    displayName: data.displayname,
                    email: data.email,
                    password: data.password,
                  },
                },
              })
            }
          >
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
                />
                <TextField
                  name="displayname"
                  label="Display Name"
                  isRequired
                  type={DisplayName}
                  maxLength={DISPLAY_NAME_LENGTH_MAX}
                  isDisabled={isSubmitting}
                />
                <TextField
                  name="password"
                  label="Password"
                  fieldType="password"
                  isRequired
                  type={Password}
                  maxLength={PASSWORD_LENGTH_MAX}
                  isDisabled={isSubmitting}
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
                  validate={str => {
                    const passwordEl = document.getElementsByName(
                      'password',
                    )[0] as HTMLInputElement;
                    if (passwordEl && str !== passwordEl.value) return 'Password does not match';
                    return undefined;
                  }}
                />
                <Footer>
                  <FormFooter>
                    <Button type="submit" appearance="primary" isLoading={isSubmitting}>
                      Sign Up
                    </Button>
                  </FormFooter>
                </Footer>
              </form>
            )}
          </Form>
        )}
      </Mutation>
    );
  }
}
