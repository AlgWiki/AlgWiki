import { snakeCase } from "change-case";

import { IBoundary } from "../../Boundary";
import { Challenge, ChallengeRenderer } from "../../Challenge";
import { Dictionary, Type, Variant } from "../../Type";
import { RustTypeRenderer } from "./RustTypeRenderer";
import { RustValueRenderer } from "./RustValueRenderer";

export class RustChallengeRenderer<
  Input extends Variant,
  Output extends Variant
> implements ChallengeRenderer<Input, Output>
{
  private readonly typeTemplater = new RustTypeRenderer();
  private readonly valueTemplater = new RustValueRenderer();

  private identifier(name: string): string {
    return snakeCase(name);
  }

  public createDefaultCode({
    name,
    inputs,
    output,
  }: Challenge<Input, Output>): string {
    const challengeIdent = this.identifier(name);
    const inputTypeStr = inputs[0].render(this.typeTemplater);
    const outputTypeStr = output.render(this.typeTemplater);
    return `
      fn ${challengeIdent}(input: ${inputTypeStr}) -> ${outputTypeStr} {
        todo!()
      }
    `;
  }

  private serialiseDict(output: Type<Output>): string {
    if (!(output.inner instanceof Dictionary)) {
      throw new Error(
        `Attempted to serialise a type that wasn't a Dictionary!`
      );
    }

    // map the HashMap into a Vec<(key, value)> so keys aren't casted to strings when JSON encoded
    const t1 = this.typeTemplater.single(output.inner.type.key);
    const t2 = this.typeTemplater.single(output.inner.type.value);
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
    const inputTypeStr = challenge.inputs[0].render(this.typeTemplater);
    const inputValueStr = challenge.inputs
      .map((input) => input.render(this.valueTemplater))
      .join(",\n");

    const outputTypeStr = challenge.output.render(this.typeTemplater);
    return `
      ${userCode}

      fn main() {
        let ${inputIdent}: Vec<${inputTypeStr}> = vec![
          ${inputValueStr}
        ];
        for tc in ${inputIdent} {
          let result = {
            let result: ${outputTypeStr} = ${challengeIdent}(tc);
            ${
              challenge.output.isDictionary()
                ? this.serialiseDict(challenge.output)
                : "result"
            }
          };

          println!(
            "{boundary_start}{result:?}{boundary_end}",
            boundary_start = "${boundary.start}",
            boundary_end = "${boundary.end}",
            result = serde_json::json!(result).to_string()
          );
        }
      }
    `;
  }
}
