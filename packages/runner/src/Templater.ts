import { Boundary } from "./Boundary";
import { Challenge } from "./Challenge";
import { Variant } from "./Type";

export interface LanguageTemplater<I extends Variant, O extends Variant> {
  imageName: string;
  output(
    challenge: Challenge<I, O>,
    userCode: string,
    mountPath: string
  ): Promise<Boundary>;
}
