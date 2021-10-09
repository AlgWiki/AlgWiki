/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Primitive, Type } from "../Type";

Type.single(Primitive.Integer, 1);
Type.single(Primitive.Float, 1.0);
Type.single(Primitive.String, "asdf");
Type.single(Primitive.Boolean, true);
// @ts-expect-error
Type.single(Primitive.Integer, "1");
// @ts-expect-error
Type.single(Primitive.Float, "1.0");
// @ts-expect-error
Type.single(Primitive.String, 1);
// @ts-expect-error
Type.single(Primitive.Boolean, "true");

Type.list(Primitive.Integer, [1]);
Type.list(Primitive.Float, [1.0]);
Type.list(Primitive.String, ["asdf"]);
Type.list(Primitive.Boolean, [true]);
// @ts-expect-error
Type.list(Primitive.Integer, ["1"]);
// @ts-expect-error
Type.list(Primitive.Float, ["1.0"]);
// @ts-expect-error
Type.list(Primitive.String, [1]);
// @ts-expect-error
Type.list(Primitive.Boolean, ["true"]);

Type.linkedList(Primitive.Integer, [1]);
Type.linkedList(Primitive.Float, [1.0]);
Type.linkedList(Primitive.String, ["asdf"]);
Type.linkedList(Primitive.Boolean, [true]);
// @ts-expect-error
Type.linkedList(Primitive.Integer, ["1"]);
// @ts-expect-error
Type.linkedList(Primitive.Float, ["1.0"]);
// @ts-expect-error
Type.linkedList(Primitive.String, [1]);
// @ts-expect-error
Type.linkedList(Primitive.Boolean, ["true"]);

Type.dictionary(
  { key: Primitive.Integer, value: Primitive.Integer },
  new Map([[1, 1]])
);
Type.dictionary(
  { key: Primitive.Float, value: Primitive.Float },
  new Map([[1.0, 1.0]])
);
Type.dictionary(
  { key: Primitive.String, value: Primitive.String },
  new Map([["asdf", "asdf"]])
);
Type.dictionary(
  { key: Primitive.Boolean, value: Primitive.Boolean },
  new Map([[true, true]])
);
Type.dictionary(
  { key: Primitive.Integer, value: Primitive.Integer },
  // @ts-expect-error
  new Map([["1", "1"]])
);
Type.dictionary(
  { key: Primitive.Float, value: Primitive.Float },
  // @ts-expect-error
  new Map([["1.0", "1.0"]])
);
Type.dictionary(
  { key: Primitive.String, value: Primitive.String },
  // @ts-expect-error
  new Map([[1, 1]])
);
Type.dictionary(
  { key: Primitive.Boolean, value: Primitive.Boolean },
  // @ts-expect-error
  new Map([["true", "true"]])
);
