import type { IncomingMessageServer, Server } from "http";
import type { Socket } from "net";

export interface Props {
  [name: string]: unknown;
}

export interface O2IncomingMessage extends IncomingMessageServer {
  /** Server error events received so far. */
  errors: {}[];
  socket: O2Socket;
}

export interface O2Socket extends Socket {
  server: Server;
  clientError?: { err: unknown; status: number };
}

export interface O2ServiceErrorData<R extends Props, L extends Props> {
  /**
   * Data to respond to the request with.
   * This property is made non-enumerable and as such will not be logged and can contain sensitive data.
   */
  responseData?: R;
  /** Data to log. This should not contain sensitive data. */
  logData?: L;
  /** HTTP status code to respond with. */
  status?: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface O2Error<R extends Props, L extends Props>
  extends O2ServiceErrorData<R, L> {}
export class O2Error<R extends Props, L extends Props> extends Error {
  constructor(
    /**
     * Description of the error.
     * Should be a string literal to identify the type of error with specific details in the details
     * options.
     */
    message: string,
    data: O2ServiceErrorData<R, L> = {}
  ) {
    super(message);
    Object.assign(this, data);

    Object.defineProperty(this, "responseData", {
      value: data.responseData,
      enumerable: false,
    });
  }
}

export const sanitizeErrorForLogging = (err: unknown): unknown => {
  if (!(err instanceof Error)) return { message: "Unknown error" };

  const shouldReplaceMessage = !(err instanceof O2Error);

  const sanitizedErr: O2Error<Props, Props> =
    new (err.constructor as typeof Error)(
      shouldReplaceMessage ? "" : err.message
    );

  // First line of stack trace is `${myObject.name}: ${myObject.message}`
  // https://nodejs.org/api/errors.html#errors_error_capturestacktrace_targetobject_constructoropt
  if (err.stack) {
    sanitizedErr.stack = shouldReplaceMessage
      ? err.stack.replace(/^([^:\n]+):[^\n]*/, "$1")
      : err.stack;
  }
  if ((err as O2Error<Props, Props>).logData)
    sanitizedErr.logData = (err as O2Error<Props, Props>).logData;
  return sanitizedErr;
};
