import { promises as fs } from "fs";
import { join, resolve } from "path";

import { Challenge } from "../../Challenge";
import { Templater } from "../../Templater";
import { Variant } from "../../Type";
import { RustChallengeRenderer } from "../renderer";

export class RustTemplater<Input extends Variant, Output extends Variant>
  implements Templater<Input, Output>
{
  #templateCargoToml = resolve(__dirname, "..", "template", "Cargo.toml");
  #challengeRenderer = new RustChallengeRenderer();

  async output(
    challenge: Challenge<Input, Output>,
    userCode: string,
    outputDir: string
  ): Promise<void> {
    const runnerCode = await challenge.createRunner(
      this.#challengeRenderer,
      userCode
    );

    const outputCargoToml = join(outputDir, "Cargo.toml");
    const outputSrc = join(outputDir, "src");
    const outputMainRs = join(outputSrc, "main.rs");

    await fs.mkdir(outputSrc, { recursive: true });
    await fs.writeFile(outputMainRs, runnerCode);
    await fs.writeFile(
      outputCargoToml,
      await fs.readFile(this.#templateCargoToml)
    );
  }
}
