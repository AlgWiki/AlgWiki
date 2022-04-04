import { URL } from "url";

export const replaceDefinitionRefsWithComponents = (
  obj: Record<string, unknown>
): void => {
  for (const [key, value] of Object.entries(obj)) {
    if (key === "$ref" && typeof value === "string") {
      obj[key] = value.replace("#/definitions/", "#/components/schemas/");
    } else if (typeof value === "object" && value !== null) {
      replaceDefinitionRefsWithComponents(value as Record<string, unknown>);
    }
  }
};

export const removeNestedUndefinedsFromObject = (
  obj: Record<string, unknown>
): void => {
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      delete obj[key];
    } else if (typeof value === "object" && value !== null) {
      removeNestedUndefinedsFromObject(value as Record<string, unknown>);
    }
  }
};

export const getStackTrace = (limit = Infinity): NodeJS.CallSite[] => {
  const oldLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = limit;
  const hasPrepareStackTrace = "prepareStackTrace" in Error;
  const prepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_target, trace) => trace;

  try {
    const target: { stack: NodeJS.CallSite[] } = { stack: [] };
    Error.captureStackTrace(target, getStackTrace);
    return target.stack;
  } finally {
    if (hasPrepareStackTrace) Error.prepareStackTrace = prepareStackTrace;
    else delete Error.prepareStackTrace;
    Error.stackTraceLimit = oldLimit;
  }
};

export const isUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};
