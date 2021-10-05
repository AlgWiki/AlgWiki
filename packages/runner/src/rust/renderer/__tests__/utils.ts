import { InferredPrimitive, Primitive, Type, Variant } from "../../../Type";

const types: {
  [P in Primitive]: [P, InferredPrimitive<P>];
} & [Primitive, InferredPrimitive<Primitive>][] = [
  [Primitive.Integer, 42],
  [Primitive.Float, 1.337],
  [Primitive.String, "1986"],
  [Primitive.Boolean, true],
];
// build a matrix of possible combinations
export const typeMatrix: Type<Variant>[] = types.flatMap(([t, v]) => [
  Type.single(t, v),
  Type.list(t, [v]),
  Type.linkedList(t, [v]),
  ...types
    .filter(([u]) => u !== t)
    .flatMap(([u, w]) =>
      Type.dictionary({ key: t, value: u }, new Map([[v, w]]))
    ),
]);
