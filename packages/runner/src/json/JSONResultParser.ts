import { isEncodedResultError, isObject } from "@alg-wiki/types";

import { Boundary } from "../Boundary";
import { ParsedResult, ResultParser } from "../ResultParser";
import { InferredPrimitive, Primitive, Type } from "../Type";

export type JSONDictionary<K extends Primitive, V extends Primitive> = {
  key: InferredPrimitive<K>;
  value: InferredPrimitive<V>;
}[];

export interface JSONLinkedList<T> {
  value: T;
  next: JSONLinkedList<T> | null;
}

export class JSONResultParser implements ResultParser {
  parse(rawString: string, boundary: Boundary): ParsedResult {
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawString);
    } catch (err) {
      return {
        unknown: {
          raw: rawString,
          error: err as SyntaxError,
        },
      };
    }

    // check if this call resulted in an error
    if (isEncodedResultError(parsed, boundary.error)) {
      // TODO: doesn't strip unknown values
      return {
        error: parsed[boundary.error],
      };
    }

    // it was successfully parsed as JSON, and it wasn't an encoded error, so it's a value
    // now we decode it into a Type
    return this.parseType(parsed);
  }

  private parsePrimitive(x: unknown): Primitive | null {
    switch (typeof x) {
      case "number":
        if (Number.isInteger(x)) {
          return Primitive.Integer;
        } else if (!Number.isNaN(x)) {
          return Primitive.Float;
        }
        break;
      case "string":
        return Primitive.String;
      case "boolean":
        return Primitive.Boolean;
    }

    return null;
  }

  private isJSONLinkedList(x: unknown): x is JSONLinkedList<any> {
    const seen = new Set();
    const check = (y: unknown): boolean => {
      // prevent circular lists from looping infinitely
      if (seen.has(y)) {
        return true;
      }
      seen.add(y);

      // does it look like a linked list?
      return (
        isObject(y) &&
        "value" in y &&
        "next" in y &&
        (y.next === null || check(y.next))
      );
    };

    return check(x);
  }

  private collapseLinkedList<P extends Primitive>(
    x: JSONLinkedList<InferredPrimitive<P>>
  ): InferredPrimitive<P>[] {
    const values: InferredPrimitive<P>[] = [];
    let current: JSONLinkedList<InferredPrimitive<P>>["next"] = x;
    do {
      values.push(current.value);
      current = current.next;
    } while (current);

    return values;
  }

  private isJSONDictionary(x: unknown): x is JSONDictionary<any, any> {
    if (!Array.isArray(x)) {
      return false;
    }

    // can't make any more assumptions without knowing the element, so we require it
    if (x.length === 0) {
      return false;
    }

    return x.every((e) => "key" in e && "value" in e);
  }

  private parseType(x: unknown): ParsedResult {
    switch (typeof x) {
      // Primitive
      case "boolean":
      case "number":
      case "string":
        {
          const p = this.parsePrimitive(x);
          if (p) {
            return { value: Type.single(p, x) };
          }
        }
        break;
      case "object":
        // List
        if (Array.isArray(x) && x.length) {
          const p = this.parsePrimitive(x[0]);
          if (p) {
            return { value: Type.list(p, x) };
          }
        }
        if (isObject(x)) {
          // LinkedList
          if (this.isJSONLinkedList(x)) {
            const p = this.parsePrimitive(x.value);
            if (p) {
              return { value: Type.linkedList(p, this.collapseLinkedList(x)) };
            }
          }
          // Dictionary
          if (this.isJSONDictionary(x) && x.length) {
            const { key, value } = x[0];
            const kType = this.parsePrimitive(key);
            const vType = this.parsePrimitive(value);
            if (kType && vType) {
              return {
                value: Type.dictionary(
                  { key: kType, value: vType },
                  new Map(x.map(({ key, value }) => [key, value]))
                ),
              };
            }
          }
        }
        break;
    }

    // if we weren't certain from the above types, then return unknown
    return {
      unknown: {
        raw: x,
        error: new Error(`Unsupported value: ${x}`),
      },
    };
  }
}
