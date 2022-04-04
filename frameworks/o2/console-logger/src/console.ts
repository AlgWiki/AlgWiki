import chalk from "chalk";

import { LoggerLevel } from "./logger-interface";

export type ConsoleLogMethodKey = {
  [K in keyof Console]: Console[K] extends (...args: unknown[]) => void
    ? K
    : never;
}[keyof Console];

export interface LogMethodInfo {
  level?: LoggerLevel;
  method?: ConsoleLogMethodKey;
  acceptsFirstArgString?: boolean;
}

export const logLevels: Record<
  LoggerLevel,
  { stream: NodeJS.WriteStream; prefix: string }
> = {
  debug: { stream: process.stdout, prefix: chalk.magenta("d") },
  info: { stream: process.stdout, prefix: chalk.green("i") },
  warn: { stream: process.stderr, prefix: chalk.yellow("w") },
  error: { stream: process.stderr, prefix: chalk.red("e") },
};

/**
 * Maps console methods to logger levels.
 * If the log method calls another log method internally, the `method` property is set instead to
 * the method which is called to avoid printing the level twice.
 * Neither are set if the method does not log anything.
 *
 * https://github.com/nodejs/node/blob/master/lib/internal/console/constructor.js
 */
export const consoleLogMethods: Record<ConsoleLogMethodKey, LogMethodInfo> = {
  debug: { level: "debug", acceptsFirstArgString: true },

  info: { level: "info", acceptsFirstArgString: true },
  log: { level: "info", acceptsFirstArgString: true },
  dir: { level: "info" },
  dirxml: { level: "info" },
  timeLog: { method: "info" },
  count: { method: "info" },
  group: { method: "info" },
  groupCollapsed: { method: "info" },
  table: { method: "info" },

  warn: { level: "warn", acceptsFirstArgString: true },
  assert: { method: "warn" },

  error: { level: "error", acceptsFirstArgString: true },
  trace: { method: "error" },

  // Methods which call another logger method which is already patched
  time: {},
  timeEnd: {},

  // Methods which do not log
  clear: {},
  countReset: {},
  groupEnd: {},
  profile: {},
  profileEnd: {},
  timeStamp: {},
};
