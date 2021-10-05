import dedent from "dedent";

import { InferredPrimitive, KeyPair, Primitive, Renderer } from "../../Type";
import { RustTypeRenderer } from "./RustTypeRenderer";

export class RustValueRenderer implements Renderer {
  private readonly typeTemplater: RustTypeRenderer = new RustTypeRenderer();

  single<P extends Primitive>(t: P, v: InferredPrimitive<P>): string {
    switch (t) {
      case Primitive.Integer:
      case Primitive.Boolean:
        return JSON.stringify(v);
      case Primitive.Float: {
        let s = JSON.stringify(v);
        // Rust requires the decimal separator for float literals
        if (!s.includes(".")) {
          s += ".";
        }
        return s;
      }
      case Primitive.String:
        return `r###"${v}"###`;
      default:
        throw new Error(`Encountered unknown primitive of value: ${t}`);
    }
  }

  list<P extends Primitive>(t: P, v: InferredPrimitive<P>[]): string {
    return `vec![${v.map((u) => this.single(t, u))}]`;
  }

  linkedList<P extends Primitive>(t: P, v: InferredPrimitive<P>[]): string {
    const tType = this.typeTemplater.single(t);
    return dedent(`{
      use std::collections::LinkedList;
      let mut inner: LinkedList<${tType}> = LinkedList::new();
      ${v.map((u) => `inner.push_back(${this.single(t, u)});`).join("\n")}
      inner
    }`);
  }

  dictionary<K extends Primitive, V extends Primitive>(
    t: KeyPair<K, V>,
    v: Map<InferredPrimitive<K>, InferredPrimitive<V>>
  ): string {
    const kType = this.typeTemplater.single(t.key);
    const vType = this.typeTemplater.single(t.value);
    return dedent(`{
      use std::collections::HashMap;
      let mut inner: HashMap<${kType}, ${vType}> = HashMap::new();
      ${[...v.entries()]
        .map(
          ([kVal, vVal]) =>
            `inner.insert(${this.single(t.key, kVal)}, ${this.single(
              t.value,
              vVal
            )});`
        )
        .join("\n")}
      inner
    }`);
  }
}
