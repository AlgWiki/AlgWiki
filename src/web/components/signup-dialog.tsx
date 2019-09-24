import React, { FC } from 'react';
import * as t from 'io-ts';

import { Formik, Form, Field } from 'formik';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { OutlinedTextFieldProps } from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { TextField as FmuTextField } from 'formik-material-ui';

import {
  EMAIL_LENGTH_MAX,
  PASSWORD_LENGTH_MAX,
  DISPLAY_NAME_LENGTH_MAX,
} from '../../common/config/user';
import { LoadingButton } from './loading-button';
import { Email, DisplayName, PasswordSubmission } from '../../common/model/user/type';
import { validatePasswordStrength } from '../../common/model/user/validators';
import { api } from '../api';
import { hashPassword } from '../util/password';
// import { Email, Password, DisplayName } from 'common/dist/model/user/type';
// import { ErrorMessage } from '../common/styled';

interface FormValues {
  email: string;
  displayName: string;
  password: string;
  passwordConfirm: string;
}

const TextField: FC<
  Partial<OutlinedTextFieldProps> & {
    ioType?: t.Type<unknown>;
    validate?: (str: string) => string | undefined;
  }
> = ({ ioType, validate, ...props }) => (
  <div>
    <Field
      validate={(str: string) => {
        if (ioType) {
          const result = ioType.decode(str);
          if (result.isLeft()) return result.value.map(err => err.message).join('\n');
        }
        if (validate) {
          const result = validate(str);
          if (result) return result;
        }
        return undefined;
      }}
      component={FmuTextField}
      margin="dense"
      variant="outlined"
      fullWidth
      required
      {...props}
    />
  </div>
);

interface SignupDialogProps {
  isOpen: boolean;
  onClose: () => void;

  onSubmit: (data: { [name: string]: string }) => void;
  isSubmitting: boolean;
  errorMessage?: string;
}

export const SignupDialog: FC<SignupDialogProps> = ({
  isOpen,
  onClose,

  // errorMessage,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="signup-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <Formik<FormValues>
        initialValues={{
          email: '',
          displayName: '',
          password: '',
          passwordConfirm: '',
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const opts = {
              email: values.email,
              displayName: values.displayName,
              passwordHashStr: await hashPassword(values.password),
            };
            const res = await api.userSignup(opts);

            (window as any).api = api;
            console.log({ res, opts, values });
          } catch (err) {}
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <DialogTitle id="signup-dialog-title">Signup</DialogTitle>
            <DialogContent>
              <TextField
                name="email"
                label="Email"
                autoComplete="email"
                inputProps={{ maxLength: EMAIL_LENGTH_MAX }}
                autoFocus
                ioType={Email}
              />
              <TextField
                name="displayName"
                label="Display Name"
                autoComplete="username"
                inputProps={{ maxLength: DISPLAY_NAME_LENGTH_MAX }}
                ioType={DisplayName}
              />
              <TextField
                name="password"
                label="Password"
                autoComplete="new-password"
                type="password"
                inputProps={{ maxLength: PASSWORD_LENGTH_MAX }}
                ioType={PasswordSubmission}
                validate={str => validatePasswordStrength(str, values.email, values.displayName)}
              />
              <TextField
                name="passwordConfirm"
                label="Confirm Password"
                autoComplete="new-password"
                type="password"
                inputProps={{ maxLength: PASSWORD_LENGTH_MAX }}
                validate={str => {
                  if (str !== values.password) return 'Password does not match';
                  return undefined;
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <LoadingButton
                isLoading={isSubmitting}
                type="submit"
                color="primary"
                variant="contained"
              >
                Sign Up
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
