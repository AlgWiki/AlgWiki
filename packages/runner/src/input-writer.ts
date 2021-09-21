import { promises as fs } from "fs";

import { TestCaseType } from "@alg-wiki/types";

export class InputWriter {
  public constructor(private readonly inputs: TestCaseType[][]) {}

  public async output(outputPath: string): Promise<void> {
    await fs.writeFile(outputPath, JSON.stringify(this.inputs));
  }
}
