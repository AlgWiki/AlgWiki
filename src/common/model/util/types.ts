import * as t from 'io-ts';
import { createType } from './util';
import { maxLength, isUrl, isEmail, minLength, isInt, minNum, maxNum } from './validators';

export const opt = <A, O, I>(type: t.Type<A, O, I>) => t.union([type, t.undefined], type.name);

export const obj = <P extends t.Props>(name: string, props: P) => t.type(props, name);

export const int = (name: string, min: number = -Infinity, max: number = Infinity) =>
  createType(name, t.number, [isInt(), minNum(min), maxNum(max)]);

export const string = (name: string, maxLen: number, minLen: number = 0) =>
  createType(name, t.string, [minLength(minLen), maxLength(maxLen)]);

export const url = (name: string, maxLen: number) =>
  createType(name, t.string, [maxLength(maxLen), isUrl()]);

export const email = (name: string, maxLen: number) =>
  createType(name, t.string, [maxLength(maxLen), isEmail()]);
