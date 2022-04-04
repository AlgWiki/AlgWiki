export type JsonData =
  | null
  | boolean
  | number
  | string
  | JsonData[]
  | JsonObject;
export interface JsonObject {
  [key: string]: JsonData;
}

export type Overwrite<T extends { [K in keyof U]: unknown }, U> = {
  [K in keyof T]: K extends keyof U ? U[K] : T[K];
};

export type TupleOptionalToRequired<T, V> = V extends T ? [V] : V;

export type MaybePromise<T> = T | Promise<T>;

export type NonReadonly<T> = { -readonly [K in keyof T]: T[K] };
