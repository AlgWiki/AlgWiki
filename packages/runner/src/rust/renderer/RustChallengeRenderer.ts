import { snakeCase } from "change-case";

import { IBoundary } from "../../Boundary";
import { Challenge, ChallengeRenderer } from "../../Challenge";
import { Variant } from "../../Type";
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

    return `
      ${userCode}

      fn main() {
        let ${inputIdent}: Vec<${inputTypeStr}> = vec![
          ${inputValueStr}
        ];
        for tc in ${inputIdent} {
          println!(
            "{boundary_start}{result:?}{boundary_end}",
            boundary_start = "${boundary.start}",
            boundary_end = "${boundary.end}",
            result = ${challengeIdent}(tc)
          );
        }
      }
    `;
  }
}
