import { PassThrough } from "stream";

import { mocked } from "ts-jest/utils";

import { initLogger } from "..";
import { addToLoggerContext } from "../contextual-logger";

const nodeConsole = global.console;

beforeEach(() => {
  jest.useFakeTimers("modern").setSystemTime(123);
  for (const name of ["stdout", "stderr"]) {
    const stream = new PassThrough();
    stream.write = jest.fn(() => true);
    Object.defineProperty(process, name, {
      get: () => stream,
    });
  }
});

afterEach(() => {
  global.console = nodeConsole;
});

const expectJsonLogs = (
  expectedStdout: Record<string, unknown>[],
  expectedStderr: Record<string, unknown>[] = []
): void => {
  for (const [stream, expected] of [
    [process.stdout, expectedStdout],
    [process.stderr, expectedStderr],
  ] as const) {
    const streamWriteMock = mocked(stream.write);
    const logs = streamWriteMock.mock.calls.map((args) => args[0] as string);
    for (const [i, expectedLog] of expected.entries()) {
      if (i >= logs.length)
        throw new Error(
          `nothing logged where we expected: ${JSON.stringify(expectedLog)}`
        );
      const data = (() => {
        try {
          return JSON.parse(logs[i]) as Record<string, unknown>;
        } catch (_err) {
          throw new Error(`expected JSON log but got: ${logs[i]}`);
        }
      })();
      if (logs.length > expected.length)
        throw new Error(
          `more lines than expected logged:\n${logs
            .slice(expected.length)
            .join("\n")}`
        );
      expect(data).toEqual(expectedLog);
    }
    streamWriteMock.mockClear();
  }
};

const realSetImmediate = setImmediate;
const runInNewContext = (fn: () => Promise<void>): Promise<void> =>
  new Promise((resolve, reject) => {
    realSetImmediate(() => fn().then(resolve, reject));
  });

describe("standard usage", () => {
  it("logs messages", () => {
    initLogger();
    console.log("test");
    expectJsonLogs([{ level: 30, time: 123, msg: "test" }]);
  });

  it("logs with different levels to STDOUT", () => {
    initLogger();
    console.info("info");
    expectJsonLogs([{ level: 30, time: 123, msg: "info" }]);
    console.warn("warn");
    expectJsonLogs([{ level: 40, time: 123, msg: "warn" }]);
    console.error("error");
    expectJsonLogs([{ level: 50, time: 123, msg: "error" }]);
  });

  it("ignores debug logs in prod mode", () => {
    initLogger();
    console.debug("debug");
    expectJsonLogs([]);
  });

  it("works with no message", () => {
    initLogger();
    console.log({ x: 5 });
    expectJsonLogs([{ level: 30, time: 123, x: 5 }]);
  });

  it("logs messages with extra data", () => {
    initLogger();
    console.log("test", { x: 5 });
    expectJsonLogs([{ level: 30, time: 123, msg: "test", x: 5 }]);
  });

  it("adds extra arguments to `args` property", () => {
    initLogger();
    console.log("test", { x: 5 }, { y: 6 }, 7);
    expectJsonLogs([
      { level: 30, time: 123, msg: "test", x: 5, args: [{ y: 6 }, 7] },
    ]);
  });

  it("works with no message", () => {
    initLogger();
    console.log({ x: 5 });
    expectJsonLogs([{ level: 30, time: 123, x: 5 }]);
  });

  it.skip("logs from node module", () => {
    initLogger();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    (require("console") as Console).log({ x: 5 });
    expectJsonLogs([{ level: 30, time: 123, x: 5 }]);
  });

  it("adds and removes data from context", async () => {
    initLogger();
    console.log("test");
    expectJsonLogs([{ level: 30, time: 123, msg: "test" }]);
    await runInNewContext(async () => {
      addToLoggerContext({ a: 1, b: 2 });
      console.log("test");
      expectJsonLogs([{ level: 30, time: 123, msg: "test", a: 1, b: 2 }]);
      await runInNewContext(async () => {
        addToLoggerContext({ b: 3, c: 4 });
        console.log("test");
        expectJsonLogs([
          { level: 30, time: 123, msg: "test", a: 1, b: 3, c: 4 },
        ]);
      });
      console.log("test");
      expectJsonLogs([{ level: 30, time: 123, msg: "test", a: 1, b: 2 }]);
    });
    console.log("test");
    expectJsonLogs([{ level: 30, time: 123, msg: "test" }]);
  });
});

describe("dev mode", () => {
  it("logs messages", () => {
    initLogger({ useDevLogger: true });
    console.log("test");
    expect(mocked(process.stdout.write).mock.calls[0][0]).toContain("test");
  });

  it("logs debug level", () => {
    initLogger({ useDevLogger: true });
    console.debug("test");
    expect(mocked(process.stdout.write).mock.calls[0][0]).toContain("test");
  });
});
