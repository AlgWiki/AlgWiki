import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

export class ValidationError extends Error {
  status: number;
  body: {};
  constructor(public result: t.Validation<any>) {
    super('Validation error');
    this.status = 400;
    console.log({ result });
    this.body = {
      err: 'Validation error',
      errors: PathReporter.report(result),
    };
  }
}

export class Route<I, O> {
  _I: I;
  _O: O;

  constructor(public inputType: t.Type<I>, public handler: (data: I) => Promise<O>) {}

  run(input: unknown) {
    const result = this.inputType.decode(input);
    if (result.isLeft()) {
      throw new ValidationError(result);
    }
    return this.handler(result.value);
  }
}
