import { InferredPrimitive, Primitive, Type, Variant } from "../../../Type";

// all possible types with sample values
const types: Record<Primitive, InferredPrimitive<Primitive>> = {
  [Primitive.Integer]: 42,
  [Primitive.Float]: 1.337,
  [Primitive.String]: "1986",
  [Primitive.Boolean]: true,
};
// TODO: is there a nice way to have a type above that forces you to use all
// variants of an enum, but then also get a nicely typed iterator on its entries?
const typeEntries: [Primitive, InferredPrimitive<Primitive>][] = Object.entries(
  types
).map(([k, v]) => [+k, v]);
// build a matrix of possible combinations
export const typeMatrix: Type<Variant>[] = typeEntries.flatMap(([t, v]) => [
  Type.single(t, v),
  Type.list(t, [v]),
  Type.linkedList(t, [v]),
  ...typeEntries
    .filter(([u]) => u !== t)
    .flatMap(([u, w]) =>
      Type.dictionary({ key: t, value: u }, new Map([[v, w]]))
    ),
]);
