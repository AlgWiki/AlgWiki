import { ChildProcessWithoutNullStreams } from "child_process";
import EventEmitter from "events";
import { Readable } from "stream";

import {
  TestCaseType,
  UserResult,
  isEncodedResultError,
} from "@alg-wiki/types";

import { Boundary } from "./boundary";

export enum ResultEmitterEvent {
  Result = "result",
  Stdout = "stdout",
  Stderr = "stderr",
  Close = "close",
}

// TODO: type-safety when adding listeners (get callbacks to have the right types/args/etc)
export class ResultEmitter extends EventEmitter {
  private _stdout = "";

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
    this.child.stderr.on("data", (data: string) =>
      this.emit(ResultEmitterEvent.Stderr, data)
    );

    // Emit errors
    this.child.on("error", (err) => {
      this.emit("error", err);
      this.destroy();
    });

    // On close
    this.child.on("close", (code, signal) => {
      // Emit any remaining stdout
      if (this._stdout.length) {
        // TODO: this may contain a boundary start marker, and/or part of a boundary end marker
        this.emit(ResultEmitterEvent.Stdout, this._stdout);
      }

      // Emit the close event
      this.emit(ResultEmitterEvent.Close, code, signal);
      this.destroy();
    });
  }

  // Listens to stdout, stripping and emitting results as it finds them, as well as emitting chunks of stdout
  private emitResults(stdout: Readable): void {
    stdout.on("data", (data: string) => {
      this._stdout += data;
      // emit all results we've got thus far
      let beg: number, end: number;
      while (
        ~(beg = this._stdout.indexOf(this.boundary.start)) &&
        ~(end = this._stdout.indexOf(this.boundary.end))
      ) {
        // emit prefix (definitely know this is user stdout, no boundaries in it)
        this.emit(ResultEmitterEvent.Stdout, this._stdout.slice(0, beg));
        // emit result (definitely know that this is a result, has both boundaries)
        this.emit(
          ResultEmitterEvent.Result,
          this.parseResult(
            this._stdout.slice(beg + this.boundary.start.length, end)
          )
        );
        // keep the rest in _stdout - don't know for sure if it's completely stdout or a result
        // this is because it could end with only half of a boundary marker, etc
        //
        // NOTE: the `+ 1` handles the newline which is included in the print calls (we want the
        // calls to include a trailing newline since that helps buffer the output too)
        this._stdout = this._stdout.slice(end + this.boundary.end.length + 1);
      }
    });
  }

  // Parses results
  private parseResult(rawString: string): UserResult {
    // TODO: error handling
    const parsed: unknown = JSON.parse(rawString);

    // check if this call resulted in an error
    if (isEncodedResultError(parsed, this.boundary.error)) {
      // TODO: doesn't strip unknown values
      return {
        error: parsed[this.boundary.error],
      };
    }

    // TODO: handle non-TestCaseType values
    return {
      value: parsed as TestCaseType,
    };
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
