import { spawn } from "child_process";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import { resolve } from "path";
import { promisify } from "util";

import { Language, UserResult } from "@alg-wiki/types";
import rimraf from "rimraf";

import { Challenge } from "./Challenge";
import { ResultEmitter } from "./ResultEmitter";
import { TEMPLATER_MAP } from "./TemplaterMap";
import { Variant } from "./Type";

const rm = promisify(rimraf);

export interface RunnerOptions<I extends Variant, O extends Variant> {
  lang: Language;
  challenge: Challenge<I, O>;
}

export interface RunResult {
  stderr: string;
  stdout: string;
  results: UserResult[];
}

export class RunError extends Error {
  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class Runner<I extends Variant, O extends Variant> {
  private readonly lang: Language;
  private readonly challenge: Challenge<I, O>;
  private readonly mountPath = resolve(tmpdir(), "__algwiki__");

  public constructor(options: RunnerOptions<I, O>) {
    this.lang = options.lang;
    this.challenge = options.challenge;
  }

  public async execute(userCode: string): Promise<RunResult> {
    const emitter = await this._execute(userCode);
    return new Promise((resolve, reject) => {
      const runResult: RunResult = {
        stderr: "",
        stdout: "",
        results: [],
      };

      emitter.on("result", (result: UserResult) =>
        runResult.results.push(result)
      );
      emitter.on("stdout", (stdout) => (runResult.stdout += `${stdout}`));
      emitter.on("stderr", (stderr) => (runResult.stderr += `${stderr}`));
      emitter.on("error", (error: Error) =>
        reject(new RunError(error.message))
      );

      emitter.on(
        "close",
        // TODO: get handler types working right
        (code: number | null, signal: NodeJS.Signals | null) => {
          if (code == 0) {
            resolve(runResult);
          } else if (code == null) {
            reject(new RunError(`Process terminated with signal: ${signal}`));
          } else {
            reject(new RunError(`Process exited with code: ${code}`));
          }
        }
      );
    });
  }

  private async _execute(userCode: string): Promise<ResultEmitter> {
    // ensure that our mount dir is completely clean and exists
    await rm(this.mountPath);
    await fs.mkdir(this.mountPath);

    // create the file to execute or compile
    const templater = TEMPLATER_MAP[this.lang]();
    const boundary = await templater.output(
      this.challenge,
      userCode,
      this.mountPath
    );

    // run the docker image and incrementally parse its output
    const args = [
      "run",
      "--rm",
      `--volume=${this.mountPath}:/alg-wiki/mount`,
      `alg-wiki/${templater.imageName}`,
    ];
    return new ResultEmitter(boundary, spawn("docker", args));
  }
}
