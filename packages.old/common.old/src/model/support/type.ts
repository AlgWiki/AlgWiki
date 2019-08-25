import * as t from 'io-ts';
import { isUUID } from 'validator';

export const UUID = t.refinement(t.string, isUUID);
export type UUID = t.TypeOf<typeof UUID>;
