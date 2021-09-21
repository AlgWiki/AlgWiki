import { tmpdir } from "os";
import { join, resolve } from "path";

export class PathManager {
  public readonly userCode: string;
  public readonly mountPath: string;
  public readonly testInput: string;
  public constructor() {
    this.mountPath = resolve(tmpdir(), "__algwiki__");
    this.userCode = join(this.mountPath, "user");
    this.testInput = join(this.mountPath, "input.json");
  }
}
