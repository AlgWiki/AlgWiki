export type LoggerLevel = "debug" | "info" | "warn" | "error";

export type LoggerData = Record<string, unknown>;

type LoggerMethods = {
  [L in LoggerLevel]: {
    (message: string, ...data: unknown[]): void;
    (...data: unknown[]): void;
  };
};

export interface Logger extends LoggerMethods {}

export interface HierarchicalLogger extends Logger {
  child(data: LoggerData): HierarchicalLogger;
}
