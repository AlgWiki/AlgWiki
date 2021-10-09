export class RunError extends Error {
  constructor(message: string) {
    super(`RunError: ${message}`);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class TimeOutError extends Error {
  constructor(message: string) {
    super(`TimeOutError: ${message}`);
    Error.captureStackTrace(this, this.constructor);
  }
}
