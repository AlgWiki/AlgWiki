import { Primitive, Type } from "./types";

// pass
Type.single(Primitive.Integer, 1);
Type.single(Primitive.Float, 1.0);
Type.single(Primitive.String, "asdf");
Type.single(Primitive.Boolean, true);
// fail
Type.single(Primitive.Integer, "1");
Type.single(Primitive.Float, "1.0");
Type.single(Primitive.String, 1);
Type.single(Primitive.Boolean, "true");
// pass
Type.list(Primitive.Integer, [1]);
Type.list(Primitive.Float, [1.0]);
Type.list(Primitive.String, ["asdf"]);
Type.list(Primitive.Boolean, [true]);
// fail
Type.list(Primitive.Integer, ["1"]);
Type.list(Primitive.Float, ["1.0"]);
Type.list(Primitive.String, [1]);
Type.list(Primitive.Boolean, ["true"]);
// pass
Type.linkedList(Primitive.Integer, [1]);
Type.linkedList(Primitive.Float, [1.0]);
Type.linkedList(Primitive.String, ["asdf"]);
Type.linkedList(Primitive.Boolean, [true]);
// fail
Type.linkedList(Primitive.Integer, ["1"]);
Type.linkedList(Primitive.Float, ["1.0"]);
Type.linkedList(Primitive.String, [1]);
Type.linkedList(Primitive.Boolean, ["true"]);
// pass
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
// fail
Type.dictionary(
  { key: Primitive.Integer, value: Primitive.Integer },
  new Map([["1", "1"]])
);
Type.dictionary(
  { key: Primitive.Float, value: Primitive.Float },
  new Map([["1.0", "1.0"]])
);
Type.dictionary(
  { key: Primitive.String, value: Primitive.String },
  new Map([[1, 1]])
);
Type.dictionary(
  { key: Primitive.Boolean, value: Primitive.Boolean },
  new Map([["true", "true"]])
);
