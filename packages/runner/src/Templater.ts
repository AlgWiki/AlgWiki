import { Challenge } from "./Challenge";
import { Variant } from "./Type";

export interface Templater<Input extends Variant, Output extends Variant> {
  output(
    challenge: Challenge<Input, Output>,
    userCode: string,
    outputDir: string
  ): Promise<void>;
}
