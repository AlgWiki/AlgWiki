import { promises as fs } from "fs";
import { resolve } from "path";

import { Language, LanguageCasing } from "@alg-wiki/types";

import { Boundary } from "./boundary";

export class TemplateWriter {
  private readonly casedChallengeName: string;
  private readonly templatePath: string;

  public constructor(private readonly lang: Language, challengeName: string) {
    this.templatePath = resolve(__dirname, "..", "languages", lang, "template");
    this.casedChallengeName = LanguageCasing[this.lang](challengeName);
  }

  public async output(
    outputPath: string,
    userCode: string,
    boundary: Boundary
  ): Promise<void> {
    const template = await fs.readFile(this.templatePath, "utf-8");
    await fs.writeFile(
      outputPath,
      template
        .replace(/#\{USER_CODE\}/, userCode)
        .replace(/#\{CHALLENGE_NAME\}/, this.casedChallengeName)
        .replace(/#\{BOUNDARY\}/, boundary.marker)
    );
  }
}
