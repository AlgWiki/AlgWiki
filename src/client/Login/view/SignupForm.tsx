import React, { Component } from 'react';
import Form, { Field, FormFooter } from '@atlaskit/form';
import FieldText from '@atlaskit/field-text';
import Button from '@atlaskit/button';

import Config from '../../../../config';

export interface Props {}
export default class SignupForm extends Component<Props> {
  onSubmit() {}

  render() {
    return (
      <Form name="signup" onSubmit={this.onSubmit}>
        <Field label="Username">
          <FieldText name="username" autoFocus shouldFitContainer />
        </Field>
        <Field label="Password">
          <FieldText
            name="password"
            type="password"
            shouldFitContainer
            min={Config.Auth.PASSWORD_LENGTH_MIN}
            max={Config.Auth.PASSWORD_LENGTH_MAX}
          />
        </Field>
        <FormFooter>
          <Button type="submit" appearance="primary">
            Sign Up
          </Button>
        </FormFooter>
      </Form>
    );
  }
}
