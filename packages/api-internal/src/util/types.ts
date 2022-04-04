import * as cookie from "cookie";

export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

export type MaybePromise<T> = T | Promise<T>;

export interface CookieOpts extends cookie.CookieSerializeOptions {
  name: string;
  value: string;
}

export interface HttpReq {
  setHeader: (name: string, value: string | string[]) => void;
  setCookie: (opts: CookieOpts) => void;
}
