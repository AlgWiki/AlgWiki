import { Boundary } from "./Boundary";
import { Type, Variant } from "./Type";

interface InnerError {
  message: string;
  stack?: string;
}

// When parsing is successful and we read a type
export interface ResultValue {
  value: Type<Variant>;
}

// When parsing is unsuccessful and we failed to recognise a type
export interface ResultUnknown {
  unknown: {
    raw: unknown;
    error: InnerError;
  };
}

// When the user's code resulted in an error
export interface ResultError {
  error: InnerError;
}

export type ParsedResult = ResultValue | ResultError | ResultUnknown;

// Common interface
export interface ResultParser {
  parse(rawString: string, boundary: Boundary): ParsedResult;
}
