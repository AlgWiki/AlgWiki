export interface Challenge<
  Input extends TestCaseType[],
  Output extends TestCaseType
> {
  function: ChallengeFunction<Input, Output>;
  testCases: TestCase<Input, Output>[];
}

export interface ChallengeFunction<
  Input extends TestCaseType[],
  Output extends TestCaseType
> {
  name: string;
  input: { [K in keyof Input]: K extends number ? Arg<Input[K]> : never };
  output: ArgType<Output>;
}

export interface TestCase<
  Input extends TestCaseType[],
  Output extends TestCaseType
> {
  input: Input;
  expected: Output;
  hash: string;
}

export type TestCaseType =
  | TestCasePrimitive
  | TestCasePrimitive[]
  | TestCaseLinkedList<TestCasePrimitive>
  | Map<TestCasePrimitive, TestCasePrimitive>;
type TestCasePrimitive = null | boolean | number | string;
type TestCaseLinkedList<T> = { value: T; next: TestCaseLinkedList<T> | null };

export interface Arg<T extends TestCaseType> {
  name: string;
  type: ArgType<T>;
}
// TODO: Add set type
export type ArgType<T extends TestCaseType> =
  | (T extends null ? { type: "null" } : never)
  | (T extends boolean ? { type: "boolean" } : never)
  | (T extends number ? { type: "float" } : never)
  | (T extends BigInt ? { type: "integer" } : never)
  | (T extends string ? { type: "string" } : never)
  | (T extends Array<infer Value>
      ? Value extends TestCaseType
        ? { type: "array"; value: ArgType<Value> }
        : never
      : never)
  | (T extends TestCaseLinkedList<infer Value>
      ? Value extends TestCaseType
        ? { type: "linkedList"; value: ArgType<Value> }
        : never
      : never)
  // TODO: Have separate map (dictionary) and object (fixed-key) types
  //       Also allow fixed-key object types to be returned from solutions as tuples
  | (T extends Map<infer Key, infer Value>
      ? Key extends TestCaseType
        ? Value extends TestCaseType
          ? {
              type: "map";
              key: ArgType<Key>;
              value: ArgType<Value>;
            }
          : never
        : never
      : never);

export interface TestCaseRuns {
  error?: string;
  tests: {
    [testCaseHash: string]: {
      result?: unknown;
      output: [OutputStream, string][];
      error?: string;
    };
  };
}

export enum OutputStream {
  STDOUT,
  STDERR,
}

export enum Language {
  Node = "node",
  Rust = "rust",
  Python2 = "python2",
  Python3 = "python3",
}

export interface ResultUnknown {
  raw: string;
  error?: ResultError;
}

export interface ResultError {
  message: string;
  stack?: string;
}

export interface EncodedResultError {
  [errorBoundary: string]: ResultError;
}

// TODO: create a JudgeInput type
export type UserResult = { json: unknown } | { error: ResultError };
