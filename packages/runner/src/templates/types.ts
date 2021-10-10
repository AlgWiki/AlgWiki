import { KeyPair, Primitive } from "../Type";

export interface TypeRenderer {
  single: (t: Primitive) => string;
  list: (t: Primitive) => string;
  linkedList: (t: Primitive) => string;
  dictionary: (t: KeyPair<Primitive, Primitive>) => string;
}
