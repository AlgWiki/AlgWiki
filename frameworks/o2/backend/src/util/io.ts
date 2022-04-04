type IoNull = { type: "null" };
type IoBoolean = { type: "boolean"; value?: boolean };
type IoNumber = { type: "number"; value?: number };
type IoString = { type: "string"; value?: string };
type IoArray =
  | { type: "array"; items: O2IoType }
  | { type: "array"; tupleItems: O2IoType[] };
type IoObject = {
  type: "object";
  properties?: Record<string, O2IoType>;
  additionalProperties?: O2IoType;
};
type IoUnion = { type: "union"; types: O2IoType[] };
type IoIntersection = { type: "intersection"; types: O2IoType[] };
export type O2IoType =
  | IoNull
  | IoBoolean
  | IoNumber
  | IoString
  | IoArray
  | IoObject
  | IoUnion
  | IoIntersection;

export interface IoError {
  path: string[];
  expected: string;
  received: string;
}

const typeOf = (value: unknown): string => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
};

export const validateJson = (type: O2IoType, json: unknown): IoError[] => {
  const errors: IoError[] = [];
  const currentPath: string[] = [];

  const check = (
    pathSegment: string | undefined,
    t: O2IoType,
    v: unknown,
    checkExtraProps = true
  ): void => {
    const pushError = (): void => {
      errors.push({
        path: [...currentPath],
        expected: t.type,
        received: typeOf(v),
      });
    };
    if (pathSegment) currentPath.push(pathSegment);

    sw: switch (t.type) {
      case "union": {
        for (const type of t.types) {
          const errStartLen = errors.length;
          check(undefined, type, v);
          if (errors.length === errStartLen) break sw;
          errors.splice(errStartLen, errors.length);
        }
        errors.push({
          path: [...currentPath],
          expected: "one of the possible values",
          received: "none matching",
        });
        break;
      }
      case "intersection": {
        let requiredProps: Set<string> | undefined = new Set();
        for (const type of t.types) {
          if (type.type === "object") {
            if (type.additionalProperties) {
              requiredProps = undefined;
            } else if (type.properties && requiredProps) {
              for (const key of Object.keys(type.properties)) {
                requiredProps.add(key);
              }
            }
          }
          check(undefined, type, v, false);
        }
        if (requiredProps && typeof v === "object" && v) {
          const extraKeys: string[] = [];
          for (const key of Object.keys(v)) {
            if (!requiredProps.has(key)) extraKeys.push(key);
          }
          if (extraKeys.length > 0) {
            errors.push({
              path: [...currentPath],
              expected: "",
              received: extraKeys.join(", "),
            });
          }
        }
        break;
      }
      case "object": {
        if (typeof v !== "object" || v === null || Array.isArray(v)) {
          pushError();
        } else {
          const props = t.properties || {};
          const missingKeys = new Set(Object.keys(props));
          const extraKeys: string[] = [];
          for (const [key, value] of Object.entries(v)) {
            if (key in props) {
              missingKeys.delete(key);
              check(key, props[key], value);
            } else if (t.additionalProperties) {
              check(key, t.additionalProperties, value);
            } else if (checkExtraProps) {
              extraKeys.push(key);
            }
          }
          if (missingKeys.size > 0 || extraKeys.length > 0) {
            errors.push({
              path: [...currentPath],
              expected: [...missingKeys].join(", "),
              received: extraKeys.join(", "),
            });
          }
        }
        break;
      }
      case "array": {
        if (!Array.isArray(v)) {
          pushError();
        } else {
          for (const [key, value] of v.entries()) {
            if ("tupleItems" in t) {
              if (key in t.tupleItems) {
                check(String(key), t.tupleItems[key], value);
              }
            } else {
              check(String(key), t.items, value);
            }
          }
          if ("tupleItems" in t && v.length !== t.tupleItems.length) {
            errors.push({
              path: [...currentPath],
              expected: `length ${t.tupleItems.length}`,
              received: `length ${v.length}`,
            });
          }
        }
        break;
      }
      case "null": {
        if (v !== null) pushError();
        break;
      }
      default: {
        if (typeof v !== t.type || (t.value !== undefined && v !== t.value))
          pushError();
      }
    }

    if (pathSegment) currentPath.pop();
  };

  try {
    check(undefined, type, json);
  } catch (err) {
    errors.push({
      path: [...currentPath],
      expected: "no errors",
      received: "error while checking",
    });
  }
  return errors;
};
