import { snakeCase } from "change-case";

import { Boundary } from "../boundary";
import {
  ChallengeRenderer,
  InferredPrimitive,
  KeyPair,
  Primitive,
  Renderer,
  RunnerTemplateOptions,
  Type,
  Variant,
} from "./types";

class RustTypeTemplater implements Renderer {
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

export class RustValueTemplater implements Renderer {
  private readonly typeTemplater: RustTypeTemplater = new RustTypeTemplater();

  single<P extends Primitive>(t: P, v: InferredPrimitive<P>): string {
    switch (t) {
      case Primitive.Integer:
      case Primitive.Boolean:
        return JSON.stringify(v);
      case Primitive.Float: {
        let s = JSON.stringify(v);
        // Rust requires the decimal separator for floats
        if (!s.includes(".")) {
          s += ".0";
        }
        return s;
      }
      case Primitive.String:
        return `r###"${v}"###`;
      default:
        throw new Error("unreachable");
    }
  }
  list<P extends Primitive>(t: P, v: InferredPrimitive<P>[]): string {
    return `vec![${v.map((u) => this.single(t, u))}]`;
  }
  linkedList<P extends Primitive>(t: P, v: InferredPrimitive<P>[]): string {
    const tType = this.typeTemplater.single(t);
    return `{
      use std::collections::LinkedList;
      let mut inner: LinkedList<${tType}> = LinkedList::new();
      ${v.map((u) => `inner.push_back(${this.single(t, u)});`).join("\n")}
      inner
    }`;
  }
  dictionary<K extends Primitive, V extends Primitive>(
    t: KeyPair<K, V>,
    v: Map<InferredPrimitive<K>, InferredPrimitive<V>>
  ): string {
    const kType = this.typeTemplater.single(t.key);
    const vType = this.typeTemplater.single(t.value);
    return `{
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
    }`;
  }
}

// TODO: rust actually outputs valid JSON with its debug output (and our types...), but does it do it in all cases?
// and do we want to depend on this?
export class RustLanguageTemplater implements ChallengeRenderer {
  private readonly typeTemplater = new RustTypeTemplater();
  private readonly valueTemplater = new RustValueTemplater();

  private identifier(name: string): string {
    return snakeCase(name);
  }

  public createDefaultCode<Input extends Variant, Output extends Variant>(
    challengeName: string,
    inputType: Type<Input>,
    outputType: Type<Output>
  ): string {
    const challengeIdent = this.identifier(challengeName);
    const inputTypeStr = inputType.render(this.typeTemplater);
    const outputTypeStr = outputType.render(this.typeTemplater);
    return `
      fn ${challengeIdent}(input: ${inputTypeStr}) -> ${outputTypeStr} {
        todo!()
      }
    `;
  }

  public createRunner<Input extends Variant, Output extends Variant>({
    boundary,
    inputs,
    challengeName,
    userCode,
  }: RunnerTemplateOptions<Input, Output>): string {
    const challengeIdent = this.identifier(challengeName);
    const inputIdent = `_${this.identifier(`${boundary}_input`)}`;

    // NOTE: inputs will always be the same type
    const inputTypeStr = inputs[0].render(this.typeTemplater);
    const inputValueStr = inputs
      .map((input) => input.render(this.valueTemplater))
      .join(",\n");

    return `
      ${userCode}

      fn main() {
        let ${inputIdent}: Vec<${inputTypeStr}> = vec![
          ${inputValueStr}
        ];
        for tc in ${inputIdent} {
          println!(
            "{boundary}start{result:?}{boundary}end",
            boundary = "${boundary}",
            result = ${challengeIdent}(tc)
          );
        }
      }
    `;
  }
}

// TODO: tests
//  boundaries work
//  all types work
//  all values work
//  valid identifiers
//  throwIfNeedsValue
// TODO: invert ChallengeTemplater like I've done for the Type class

// Demo
const templater = new RustLanguageTemplater();
const name = "parseStr";
const inputs = [1, 2, 3].map((x) =>
  Type.single(Primitive.String, x.toString())
);
const output = Type.single(Primitive.Integer);
void Boundary.create().then((b) =>
  console.log(
    templater.createRunner({
      challengeName: name,
      inputs,
      output,
      boundary: b,
      userCode: templater.createDefaultCode(name, inputs[0], output),
    })
  )
);
