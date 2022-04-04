import nodeConsole from "console";

import {
  ConsoleLogMethodKey,
  LogMethodInfo,
  consoleLogMethods,
  logLevels,
} from "./console";
import { getLoggerContext } from "./contextual-logger";
import { ConsoleLogger, LoggerOpts } from "./logger";

export class DevConsoleLogger extends ConsoleLogger {
  static nodeConsole = nodeConsole;

  constructor(options: LoggerOpts) {
    super({ inspectOptions: { depth: null }, ...options });
  }
}

// During development we want to keep the nice formatting of the standard console
// The only modification is to prepend the logs with a symbol denoting the log level
for (const [name, data] of Object.entries(consoleLogMethods) as [
  ConsoleLogMethodKey,
  LogMethodInfo
][]) {
  const level = data.level;
  if (!level) continue;
  const realMethod = nodeConsole.Console.prototype[name];
  if (!realMethod) continue;
  const { stream, prefix } = logLevels[level];
  const logFn = (DevConsoleLogger.prototype[name] = function (
    ...args: unknown[]
  ) {
    const isRegularObject = (
      value: unknown
    ): value is Record<string, unknown> =>
      typeof value === "object" &&
      value !== null &&
      Object.getPrototypeOf(value) === Object;
    const dataIdx = isRegularObject(args[0])
      ? 0
      : isRegularObject(args[1])
      ? 1
      : undefined;
    const ctx = getLoggerContext();
    const argsWithContext =
      dataIdx !== undefined
        ? args.map((arg, i) => {
            if (i === dataIdx) {
              const obj = Object.create(
                arg as Record<string, unknown>
              ) as Record<string, unknown>;
              for (const key in ctx) {
                if (!(key in obj)) obj[key] = ctx[key];
              }
              return obj;
            }
            return arg;
          })
        : Object.keys(ctx).length > 0
        ? [...args, ctx]
        : args;
    if (data.acceptsFirstArgString) {
      if (typeof argsWithContext[0] === "string") {
        argsWithContext[0] = `${prefix} ${argsWithContext[0]}`;
      } else {
        argsWithContext.unshift(prefix);
      }
    } else {
      // Making the first argument a string would break some logging methods like `console.table`
      stream.write(prefix + " ");
    }
    realMethod.apply(this, argsWithContext);
  });
  Object.defineProperty(logFn, "name", {
    ...Object.getOwnPropertyDescriptor(logFn, "name"),
    value: realMethod.name,
  });
}
