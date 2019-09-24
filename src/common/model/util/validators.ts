import * as validator from 'validator';
import { Validator } from './util';

export const minLength = (min: number): Validator<string> => v =>
  !validator.isLength(v, min, Infinity) && `Must be at least ${min} characters long`;

export const maxLength = (max: number): Validator<string> => v =>
  !validator.isLength(v, 0, max) && `Must be ${max} or less characters long`;

export const minNum = (min: number): Validator<number> => v => v < min && `Must be at least ${min}`;

export const maxNum = (max: number): Validator<number> => v => v > max && `Must be ${max} or less`;

export const isInt = (): Validator<number> => v => v % 1 === 0;

export const isEmail = (): Validator<string> => v =>
  !validator.isEmail(v) && `Must be a valid email`;

export const isUrl = (): Validator<string> => v => !validator.isURL(v) && `Must be a valid URL`;
