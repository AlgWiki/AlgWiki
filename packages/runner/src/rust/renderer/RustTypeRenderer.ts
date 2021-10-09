import { Primitive, Renderer } from "../../Type";

export class RustTypeRenderer implements Renderer {
  single(t: Primitive): string {
    switch (t) {
      case Primitive.Integer:
        return "i64";
      case Primitive.Float:
        return "f64";
      case Primitive.Boolean:
        return "bool";
      case Primitive.String:
        return "&str";
    }
  }

  list(t: Primitive): string {
    return `Vec<${this.single(t)}>`;
  }

  linkedList(t: Primitive): string {
    return `LinkedList<${this.single(t)}>`;
  }

  dictionary(t: { key: Primitive; value: Primitive }): string {
    return `HashMap<${this.single(t.key)}, ${this.single(t.value)}>`;
  }
}
