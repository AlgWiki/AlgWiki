import React from 'react';
import { Field, ErrorMessage } from '@atlaskit/form';
import AkTextField from '@atlaskit/textfield';
import * as t from 'io-ts';

export interface Props {
  name: string;
  label: string;
  fieldType?: string;
  defaultValue?: string;
  autoFocus?: boolean;
  isRequired?: boolean;
  type?: t.Type<unknown>;
  maxLength?: number;
  isDisabled?: boolean;
  validate?: (value: string) => string | undefined;
}
export default function TextField({
  name,
  label,
  fieldType = 'text',
  defaultValue = '',
  autoFocus = false,
  isRequired = false,
  type,
  maxLength = Infinity,
  isDisabled = false,
  validate = () => undefined,
}: Props) {
  return (
    <Field
      name={name}
      label={label}
      defaultValue={defaultValue}
      isRequired={isRequired}
      isDisabled={isDisabled}
      validate={
        type &&
        ((str: string) => {
          if (!str) return undefined;
          const typeResult = type.decode(str);
          if (typeResult.isLeft()) {
            return typeResult.value[0].message || 'Invalid value';
          }
          if (validate) {
            const validateResult = validate(str);
            if (validateResult) return validateResult;
          }
          return undefined;
        })
      }
    >
      {({ fieldProps, error }: any) => (
        <>
          <AkTextField
            {...fieldProps}
            type={fieldType}
            autoFocus={autoFocus}
            // TODO: Dynamically prevent typing upon reaching the max length
            maxLength={maxLength}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </>
      )}
    </Field>
  );
}
