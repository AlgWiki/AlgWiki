import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { SignupForm } from './view';

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

export default function Signup() {
  return (
    <Mutation mutation={USER_SIGNUP}>
      {(userSignup, { loading: isSubmitting, error }) => (
        <SignupForm
          onSubmit={data =>
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
          isSubmitting={isSubmitting}
          errorMessage={error && error.message}
        />
      )}
    </Mutation>
  );
}
