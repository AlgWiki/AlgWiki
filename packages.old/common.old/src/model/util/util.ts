import * as t from 'io-ts';

export type Validator<T> = (value: T) => string | boolean;

export const createType = <T>(name: string, baseType: t.Type<T>, validators: Validator<T>[]) =>
  new t.Type(
    name,
    (v): v is T =>
      baseType.is(v) && validators.every(validator => typeof validator(v) !== 'string'),
    (v, ctx) => {
      const result = baseType.validate(v, ctx);
      if (result.isLeft()) return result;
      const errors = validators
        .map(validator => validator(result.value))
        .filter(result => typeof result === 'string')
        .map(message => ({
          value: result.value,
          context: ctx,
          message: message as string,
        }));
      return errors.length > 0 ? t.failures(errors) : t.success(result.value);
    },
    baseType.encode,
  );
