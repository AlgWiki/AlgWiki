import { AsyncLocalStorage } from "async_hooks";

import type { HierarchicalLogger, LoggerData } from "./logger-interface";

const ctxData = new AsyncLocalStorage<LoggerData>();
const ctxLogger = new AsyncLocalStorage<HierarchicalLogger>();

export const initContextualLogger = (logger: HierarchicalLogger): void => {
  if (ctxLogger.getStore())
    throw new Error("contextual logger already initialized");
  ctxLogger.enterWith(logger);

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    (require("@oxy2/magic") as typeof import("@oxy2/magic")).declareMagic({
      description:
        "Logger uses `AsyncLocalStorage` to have different context objects per request without having to pass them in explicitly",
      // TODO: Update to README URL
      docs: "../README.md",
    });
  } catch {}
};

export const getLoggerContext = (): LoggerData => ctxData.getStore() || {};

export const addToLoggerContext = (data: LoggerData): void => {
  const ctxDataNew = Object.create(getLoggerContext()) as LoggerData;
  ctxData.enterWith(Object.assign(ctxDataNew, data));

  const logger = ctxLogger.getStore();
  if (logger) ctxLogger.enterWith(logger.child(data));
};

export const getContextualLogger = (): HierarchicalLogger => {
  const logger = ctxLogger.getStore();
  if (!logger) throw new Error("contextual logger is not initialized");
  return logger;
};
