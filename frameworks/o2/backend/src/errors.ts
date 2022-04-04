import { O2Error, Props } from "@oxy2/utils";

export class O2ServiceError<R extends Props, L extends Props> extends O2Error<
  R,
  L
> {}

export class O2ClientError<
  R extends Props,
  L extends Props
> extends O2ServiceError<R, L> {}
export type O2ClientErrorAny = O2ClientError<Props, Props>;
