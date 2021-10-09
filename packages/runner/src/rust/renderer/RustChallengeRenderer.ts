import { snakeCase } from "change-case";
import dedent from "dedent";

import { IBoundary } from "../../Boundary";
import { Challenge, ChallengeRenderer } from "../../Challenge";
import { Dictionary, LinkedList, Type, Variant } from "../../Type";
import { RustTypeRenderer } from "./RustTypeRenderer";
import { RustValueRenderer } from "./RustValueRenderer";

export class RustChallengeRenderer<
  Input extends Variant,
  Output extends Variant
> implements ChallengeRenderer<Input, Output>
{
  private readonly typeRenderer = new RustTypeRenderer();
  private readonly valueRenderer = new RustValueRenderer();

  private identifier(name: string): string {
    return snakeCase(name);
  }

  public createDefaultCode({
    name,
    inputs,
    output,
  }: Challenge<Input, Output>): string {
    const challengeIdent = this.identifier(name);
    const inputTypeStr = inputs[0].render(this.typeRenderer);
    const outputTypeStr = output.render(this.typeRenderer);
    return dedent(`
      fn ${challengeIdent}(input: ${inputTypeStr}) -> ${outputTypeStr} {
        todo!()
      }
    `);
  }

  private serialiseLinkedList(
    output: Type<Output>,
    boundary: IBoundary
  ): string {
    if (!(output.inner instanceof LinkedList)) {
      throw new Error(
        `Attempted to serialise a type that wasn't a LinkedList!`
      );
    }

    return dedent(`{
      "${boundary.marker}_linkedList": {
        "inner": result,
      }
    }`);
  }

  private serialiseDict(output: Type<Output>): string {
    if (!(output.inner instanceof Dictionary)) {
      throw new Error(
        `Attempted to serialise a type that wasn't a Dictionary!`
      );
    }

    // map the HashMap into a Vec<(key, value)> so keys aren't cast to strings when JSON encoded
    const t1 = this.typeRenderer.single(output.inner.type.key);
    const t2 = this.typeRenderer.single(output.inner.type.value);
    return `result.into_iter().collect::<Vec<(${t1}, ${t2})>>()`;
  }

  public createRunner(
    challenge: Challenge<Input, Output>,
    boundary: IBoundary,
    userCode: string
  ): string {
    const challengeIdent = this.identifier(challenge.name);
    const inputIdent = `_${this.identifier(`${boundary.marker}_input`)}`;

    // NOTE: inputs will always be the same type
    const inputTypeStr = challenge.inputs[0].render(this.typeRenderer);
    const inputValueStr = challenge.inputs
      .map((input) => input.render(this.valueRenderer))
      .join(",\n");

    const outputTypeStr = challenge.output.render(this.typeRenderer);
    return dedent(`
      ${userCode}

      fn main() {
        let ${inputIdent}: Vec<${inputTypeStr}> = vec![
          ${inputValueStr}
        ];
        for tc in ${inputIdent} {
          let json = {
            let result: ${outputTypeStr} = ${challengeIdent}(tc);
            serde_json::json!(${
              challenge.output.isDictionary()
                ? this.serialiseDict(challenge.output)
                : challenge.output.isLinkedList()
                ? this.serialiseLinkedList(challenge.output, boundary)
                : "result"
            })
          };

          println!(
            "{boundary_start}{result}{boundary_end}",
            boundary_start = "${boundary.start}",
            boundary_end = "${boundary.end}",
            result = json
          );
        }
      }
    `);
  }
}
