import { spawn } from "child_process";
import { promises as fs } from "fs";
import { promisify } from "util";

import {
  Language,
  TestCase,
  TestCaseType,
  UserResult,
  ValidatedUserResult,
} from "@alg-wiki/types";
import rimraf from "rimraf";

import { Boundary } from "./boundary";
import { InputWriter } from "./input-writer";
import { PathManager } from "./path-manager";
import { ResultEmitter } from "./result-emitter";
import { TemplateWriter } from "./template-writer";

const rm = promisify(rimraf);

export interface RunnerOptions {
  lang: Language;
  challengeName: string;
  testCases: TestCase<TestCaseType[], TestCaseType>[];
}

export interface RunResult {
  stderr: string;
  stdout: string;
  results: ValidatedUserResult[];
}

export class RunError extends Error {
  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class Runner {
  private readonly lang: Language;
  private readonly paths: PathManager;
  private readonly templateWriter: TemplateWriter;
  private readonly inputWriter: InputWriter;
  private readonly testCases: TestCase<TestCaseType[], TestCaseType>[];

  public constructor(options: RunnerOptions) {
    this.lang = options.lang;
    this.testCases = options.testCases;
    this.paths = new PathManager();
    this.templateWriter = new TemplateWriter(
      options.lang,
      options.challengeName
    );
    this.inputWriter = new InputWriter(this.testCases.map((tc) => tc.input));
  }

  public async execute(userCode: string): Promise<RunResult> {
    const emitter = await this._execute(userCode);
    return new Promise((resolve, reject) => {
      const runResult: RunResult = {
        stderr: "",
        stdout: "",
        results: [],
      };

      emitter.on("result", (result: UserResult) => {
        const i = runResult.results.length;
        runResult.results.push({
          ...result,
          passed: !result.error && this.testCases[i].expected === result.value,
        });
      });
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
    // randomise the boundary each run
    const boundary = await Boundary.create();

    // ensure that our mount dir is completely clean and exists
    await rm(this.paths.mountPath);
    await fs.mkdir(this.paths.mountPath);

    // create the file to execute or compile
    await this.templateWriter.output(this.paths.userCode, userCode, boundary);

    // create the test input JSON array
    await this.inputWriter.output(this.paths.testInput);

    // run the docker image and incrementally parse its output
    const args = [
      "run",
      "--rm",
      `--volume=${this.paths.mountPath}:/alg-wiki/mount`,
      `alg-wiki/${this.lang}`,
    ];
    return new ResultEmitter(boundary, spawn("docker", args));
  }
}
