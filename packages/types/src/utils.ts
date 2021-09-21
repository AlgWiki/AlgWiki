import { snakeCase } from "change-case";

import { EncodedResultError, Language } from "./types";

export function isObject(x: unknown): x is Record<string, unknown> {
  // If `x` is already an object, it's returned. Otherwise it's wrapped.
  // Therefore this will check if a value is an object, and also rule out null/undefined.
  return x === new Object(x);
}

// TODO: doesn't perform a deep check
export function isEncodedResultError(
  x: unknown,
  boundaryKey: string
): x is EncodedResultError {
  return isObject(x) && boundaryKey in x;
}

export const LanguageCasing: Record<Language, (name: string) => string> = {
  [Language.Python3]: snakeCase,
};
