import { ChildProcessWithoutNullStreams } from "child_process";
import EventEmitter from "events";
import { Readable } from "stream";

import { UserResult, isEncodedResultError } from "@alg-wiki/types";

import { Boundary } from "./Boundary";
import { RunError } from "./Errors";

export enum ResultEmitterEvent {
  Result = "result",
  Stdout = "stdout",
  Stderr = "stderr",
  Close = "close",
  Error = "error",
}

export class ResultEmitter extends EventEmitter {
  #stdout = "";

  public constructor(
    private readonly boundary: Boundary,
    private readonly child: ChildProcessWithoutNullStreams
  ) {
    super();

    // Set encodings
    // TODO: revisit this when we have languages which don't output UTF-8
    child.stdout.setEncoding("utf-8");
    child.stderr.setEncoding("utf-8");

    // emit results as they're emitted from the stream
    this.emitResults(this.child.stdout);

    // re-emit stderr as it's emitted
    this.child.stderr.on("data", (data: Buffer | string) => {
      console.debug(`stderr: ${data.toString().trim()}`);
      this.emit(ResultEmitterEvent.Stderr, data);
    });

    // emit spawn events
    this.child.on("spawn", () => {
      this.emit("spawn");
    });

    // emit errors
    this.child.on("error", (err) => {
      console.debug(`error: ${err}`);
      this.emit("error", err);
      this.destroy();
    });

    // on close
    this.child.on("close", (code, signal) => {
      console.debug(`close: ${JSON.stringify({ code, signal })}`);
      if (this.#stdout.length) {
        // last check for any leftover results
        this.extractResults();
        // emit the rest as stdout
        this.emit(ResultEmitterEvent.Stdout, this.#stdout);
      }

      // emit the close event
      this.emit(ResultEmitterEvent.Close, code, signal);
      this.destroy();
    });
  }

  // Listens to stdout, stripping and emitting results as it finds them, as well as emitting chunks of stdout
  private emitResults(stdout: Readable): void {
    stdout.on("data", (data: Buffer | string) => {
      console.debug(`stdout: ${data.toString().trim()}`);
      this.#stdout += data;
      this.extractResults();
    });
  }

  private extractResults(): void {
    // emit all results we've got thus far
    let beg: number, end: number;
    while (
      ~(beg = this.#stdout.indexOf(this.boundary.start)) &&
      ~(end = this.#stdout.indexOf(this.boundary.end))
    ) {
      // emit prefix (definitely know this is user stdout, no boundaries in it)
      this.emit(ResultEmitterEvent.Stdout, this.#stdout.slice(0, beg));
      // emit result (definitely know that this is a result, has both boundaries)
      this.emit(
        ResultEmitterEvent.Result,
        this.parseResult(
          this.#stdout.slice(beg + this.boundary.start.length, end)
        )
      );
      // keep the rest in _stdout - don't know for sure if it's completely stdout or a result
      // this is because it could end with only half of a boundary marker, etc
      //
      // NOTE: the `+ 1` handles the newline which is included in the print calls (we want the
      // calls to include a trailing newline since that helps buffer the output too)
      this.#stdout = this.#stdout.slice(end + this.boundary.end.length + 1);
    }
  }

  // Parses results
  private parseResult(rawString: string): UserResult {
    let json: unknown;
    try {
      json = JSON.parse(rawString);
    } catch (err) {
      if (err instanceof Error) {
        return {
          error: new RunError(`failed to parse output: ${err.message}`),
        };
      }
    }

    // check if this call resulted in an error
    if (isEncodedResultError(json, this.boundary.error)) {
      // TODO: doesn't strip unknown values
      return {
        error: json[this.boundary.error],
      };
    }

    // is parsed as JSON, so now it's up to the judge to determine if the result was successful or not
    return { json };
  }

  // Removes all listeners and prevents this emitter from being used again.
  private destroy(): void {
    this.removeAllListeners();
    this.on =
      this.once =
      this.addListener =
      this.prependListener =
      this.prependOnceListener =
        () => {
          throw new Error(
            "This event emitter has been destroyed and should no longer be used."
          );
        };
  }
}
