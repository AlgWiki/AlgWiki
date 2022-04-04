import nodeConsole from "console";

import { O2Error } from "@oxy2/utils";

import { ConsoleLogMethodKey } from "./console";
import { getContextualLogger } from "./contextual-logger";
import {
  HierarchicalLogger,
  Logger,
  LoggerData,
  LoggerLevel,
} from "./logger-interface";

export interface LoggerOpts extends NodeJS.ConsoleConstructorOptions {
  /** The underlying logger used to print logs. Its log methods will only be
   * called with a single object as an argument. */
  logger: HierarchicalLogger;
  messageProperty?: string;
  argsProperty?: string;
}

// TODO: We might need to overwrite the methods on the real console as well so
//       that `require('console').log()` will also be intercepted
export class ConsoleLogger extends nodeConsole.Console {
  static nodeConsole = nodeConsole;
  nodeConsole = nodeConsole;
  logger: Logger;
  messageProperty: string;
  argsProperty: string;

  constructor(opts: LoggerOpts) {
    super(opts);
    this.logger = opts.logger;
    this.messageProperty = opts.messageProperty || "msg";
    this.argsProperty = opts.argsProperty || "args";
  }
}

const logWithLevel = (level: LoggerLevel) =>
  function (this: ConsoleLogger, ...args: unknown[]) {
    let msg: string | undefined;
    let data: LoggerData | undefined;
    let argIdx = 0;

    const msgArg = args[argIdx];
    if (typeof msgArg === "string") {
      msg = msgArg;
      argIdx++;
    }

    const dataArg = args[argIdx];
    if (typeof dataArg === "object" && dataArg !== null) {
      // Error objects in JS have non-enumerable `message` and `stack` properties
      const showErrorsInLogData = <T>(data: T): T => {
        if (typeof data === "object" && data !== null) {
          for (const [key, value] of Object.entries(data)) {
            if (value instanceof Error) {
              (data as LoggerData)[key] = {
                // TODO: Parse the stack into an array?
                stack: value.stack,
                err: value.message,
                ...(
                  value as O2Error<Record<string, never>, Record<string, never>>
                ).logData,
              };
            } else {
              showErrorsInLogData(value);
            }
          }
        }
        return data;
      };
      ({ data } = showErrorsInLogData({
        data: dataArg as LoggerData,
      }));
      argIdx++;
    }

    const logger = getContextualLogger();
    logger[level]({
      ...data,
      ...(argIdx < args.length && { [this.argsProperty]: args.slice(argIdx) }),
      ...(msg && { [this.messageProperty]: msg }),
    });
  };

const logMethods: {
  [K in ConsoleLogMethodKey]?: (
    this: ConsoleLogger,
    ...args: unknown[]
  ) => void;
} = {
  debug: logWithLevel("debug"),

  info: logWithLevel("info"),
  log: logWithLevel("info"),
  dir: logWithLevel("info"),
  dirxml: logWithLevel("info"),
  table: logWithLevel("info"),

  warn: logWithLevel("warn"),

  error: logWithLevel("error"),

  // TODO: Ideally these would have custom implementations to print cleanly in the logger
  //       but that would require maintenence to keep all quirks of the Node implementations.
  //       The problem with not implementing them is that people will think they are fine to use
  //       in production because they show with levels during dev but they actually may not
  //       (or at least not be formatted well).
  // https://github.com/nodejs/node/blob/master/lib/internal/console/constructor.js#L342
  // time: logWithLevel('info'),
  // timeEnd: logWithLevel('info'),
  // timeLog: logWithLevel('info'),
  // count: logWithLevel('info'),
  // assert: logWithLevel('warn'),
  // trace: logWithLevel('error'),
};
Object.assign(ConsoleLogger.prototype, logMethods);
