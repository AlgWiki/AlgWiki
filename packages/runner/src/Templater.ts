import { Boundary } from "./Boundary";
import { Challenge } from "./Challenge";
import { Variant } from "./Type";

export interface LanguageTemplater {
  imageName: string;
  output(
    challenge: Challenge<Variant, Variant>,
    userCode: string,
    mountPath: string
  ): Promise<Boundary>;
}
