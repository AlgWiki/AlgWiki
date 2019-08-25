import React from 'react';
import { Field, Validator } from '@atlaskit/form';
import FieldText from '@atlaskit/field-text';
import { FieldValidator } from '../../../model/validators/user';
import { maxUtf16Length } from '../../../util/string';

export interface Props {
  name: string;
  label: string;
  autoFocus?: boolean;
  isRequired?: boolean;
  fieldValidator?: FieldValidator<any>;
  maxLength?: number;
}
export default ({ name, label, autoFocus, isRequired, fieldValidator, maxLength }: Props) => (
  <Field
    label={label}
    isRequired={isRequired}
    validators={
      fieldValidator &&
      fieldValidator.validators.map(validator => (
        <Validator
          func={validator.validate}
          invalid={validator.message && `\n${validator.message}`}
        />
      ))
    }
  >
    <FieldText
      name={name}
      shouldFitContainer
      autoFocus={autoFocus}
      // TODO: Dynamically prevent typing upon reaching the max length
      maxLength={maxLength && maxUtf16Length(maxLength)}
    />
  </Field>
);
