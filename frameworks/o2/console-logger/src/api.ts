import pino from "pino";

import { logLevels } from "./console";
import { getContextualLogger, initContextualLogger } from "./contextual-logger";
import { DevConsoleLogger } from "./dev-logger";
import { ConsoleLogger, LoggerOpts } from "./logger";
import { HierarchicalLogger, LoggerLevel } from "./logger-interface";

/** Returns `true` if the logger has already been attached to the global console. */
export const isLoggerAttachedToConsole = (): boolean =>
  global.console.constructor === ConsoleLogger ||
  global.console.constructor === DevConsoleLogger;

export const createBaseLogger = (isDev: boolean): HierarchicalLogger =>
  pino({
    base: null,
    ...(isDev
      ? {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          prettifier: require("pino-pretty"),
          prettyPrint: {
            translateTime: true,
          },
        }
      : {}),
  });

/** Sets up the contextual logger and replaces the global `console` with the logger. */
export const initLogger = ({
  stdout = process.stdout,
  stderr = process.stderr,
  useDevLogger = false,
  logger = createBaseLogger(useDevLogger),
  useConsole = true,
}: Partial<LoggerOpts> & {
  useConsole?: boolean;
  useDevLogger?: boolean;
} = {}): void => {
  initContextualLogger(logger);
  if (useConsole) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      (require("@oxy2/magic") as typeof import("@oxy2/magic")).declareMagic({
        description:
          "`console.log` and other console methods are modified to log JSON data in prod",
        rule: "Use `console.log`",
        docs: "../README.md",
      });
    } catch {}

    // TODO: Mock console module (could use require cache but doesn't work in Jest, otherwise modify props)
    global.console = useDevLogger
      ? new DevConsoleLogger({ stdout, stderr, logger })
      : new ConsoleLogger({
          stdout,
          // Use the level property to distinguish error logs in prod
          stderr: stdout,
          logger,
        });
  }
};

/** Contextual logger.
 *
 * Logs will contain all added context. */
export const logger = {};
for (const level of Object.keys(logLevels)) {
  Object.defineProperty(logger, level, {
    get() {
      const contextualLogger = getContextualLogger();
      return contextualLogger[level as LoggerLevel];
    },
  });
}
