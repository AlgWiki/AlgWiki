import { spawn, spawnSync } from "child_process";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import { resolve } from "path";
import { promisify } from "util";

import { Language, UserResult } from "@alg-wiki/types";
import rimraf from "rimraf";

import { Challenge } from "./Challenge";
import { RunError } from "./Errors";
import { NcatTrigger } from "./NcatTrigger";
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
  durationMillis: number;
  exit: number | NodeJS.Signals | null;
  results: UserResult[];
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
      const runResult: Omit<Omit<RunResult, "durationMillis">, "exit"> = {
        stderr: "",
        stdout: "",
        results: [],
      };

      // when the container is ready to execute the code, it will wait to be
      // triggered, so we start the timer when we successfully do that
      let start: number;
      emitter.on("spawn", () => {
        new NcatTrigger("127.0.0.1", 1234)
          .trigger()
          .then((timestamp) => (start = timestamp))
          .catch((err) => reject(err));
      });

      // keep track of results as they come
      emitter.on("result", (result: UserResult) =>
        runResult.results.push(result)
      );

      // std streams and errors
      emitter.on("stdout", (stdout) => (runResult.stdout += `${stdout}`));
      emitter.on("stderr", (stderr) => (runResult.stderr += `${stderr}`));
      emitter.on("error", (error: Error) =>
        reject(new RunError(error.message))
      );

      // return result when the child closes
      emitter.on(
        "close",
        // TODO: get handler types working right
        (code: number | null, signal: NodeJS.Signals | null) =>
          resolve({
            ...runResult,
            durationMillis: Date.now() - start,
            exit: code ?? signal,
          })
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
      `--name=${boundary.marker}`,
      "--publish=1234:1234",
      `--volume=${this.mountPath}:/alg-wiki/mount`,
      `alg-wiki/${templater.imageName}`,
    ];

    // dodgy cleanup on any errors
    console.debug(`Running: docker ${args.join(" ")}`);
    const child = spawn("docker", args);
    child.on("error", (err) => {
      console.warn(`An error occurred when running: ${err.message}`);
      const killCmd = `docker kill ${boundary.marker}`;
      console.debug(`Running: ${killCmd}`);
      spawnSync(killCmd);
    });

    // pass child to the ResultEmitter to parse its output
    return new ResultEmitter(boundary, child);
  }
}
