import * as t from 'io-ts';

export class ValidationError extends Error {
  constructor(public errors: t.Errors) {
    super('Validation error');
  }
}

export class Route<I, O> {
  _I: I;
  _O: O;

  constructor(public inputType: t.Type<I>, public handler: (data: I) => Promise<O>) {}

  run(input: unknown) {
    const result = this.inputType.decode(input);
    if (result.isLeft()) {
      throw new ValidationError(result.value);
    }
    return this.handler(result.value);
  }
}
