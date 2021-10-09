import { Socket } from "net";

import { TimeOutError } from "./Errors";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms).unref());

export class NcatTrigger {
  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly timeoutMillis: number = 10_000,
    private readonly intervalMillis: number = 100
  ) {}

  /**
   * Attempts to trigger the runner every `intervalMillis`. Will reject after
   * `timeoutMillis` if it was unsuccessful.
   * @returns the timestamp of when the runner was triggered
   */
  public trigger(): Promise<number> {
    // bail out if we failed to do anything after a timeout
    const timeout = sleep(this.timeoutMillis).then(() =>
      Promise.reject(
        new TimeOutError(
          `failed to start runner, timeout out after ${this.timeoutMillis} ms`
        )
      )
    );

    // keep pinging and checking to see if we've triggered the runner
    const pingLoop = (async () => {
      let start: number | null;
      while (!(start = await this.connectToNcat())) {
        await sleep(this.intervalMillis);
      }

      return start;
    })();

    return Promise.race([timeout, pingLoop]);
  }

  private connectToNcat(): Promise<number | null> {
    return new Promise<number | null>((resolve, reject) => {
      new Socket()
        // continue on ECONNREFUSED, since it may not be ready yet
        // reject on and unexpected errors
        .on("error", (err: NodeJS.ErrnoException) =>
          err.code === "ECONNREFUSED" ? resolve(null) : reject(err)
        )
        // If we receive data that means we've connected to the inner ncat instance
        // and read its data - so immediately close our connection which will terminate
        // the inner ncat and the runner will proceed to start
        .on("data", function (this: Socket, _buf) {
          this.destroy();
          resolve(Date.now());
        })
        .on("close", (hadError) => {
          if (hadError) {
            reject(new Error("socket was closed due to a transmission error"));
          } else {
            // if our connection was closed immediately, then we've just connected
            // to the port that docker is publishing - the inner port isn't yet
            // available (ncat not running yet)
            resolve(null);
          }
        })
        // connect to the inner ncat instance
        .connect(this.port, this.host)
        .unref();
    });
  }
}
