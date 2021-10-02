// The types challenges accept
export enum Primitive {
  // Only supporting signed integers for now
  Integer,
  // 64 bit floating point (IEEE754)
  Float,
  String,
  Boolean,
}

// This is the TypeScript type of the primitive
export type InferredPrimitive<P> = P extends Primitive.Integer | Primitive.Float
  ? number
  : P extends Primitive.String
  ? string
  : P extends Primitive.Boolean
  ? boolean
  : never;

// All Types require this for type discrimination
export interface Variant {
  tag: keyof Renderer;
  type: unknown;
  value?: unknown;
  render: (renderer: Renderer) => string;
}

// A utility interface for easily matching/switching across variants
export interface Renderer {
  single: <P extends Primitive>(t: P, v: InferredPrimitive<P>) => string;
  list: <P extends Primitive>(t: P, v: InferredPrimitive<P>[]) => string;
  linkedList: <P extends Primitive>(t: P, v: InferredPrimitive<P>[]) => string;
  dictionary: <K extends Primitive, V extends Primitive>(
    t: KeyPair<K, V>,
    v: Map<InferredPrimitive<K>, InferredPrimitive<V>>
  ) => string;
}

function throwIfNeedsValue<V extends Variant>(
  v: V,
  f: Renderer[V["tag"]]
): string {
  if (f.length == 2 && !v.value) {
    throw new Error(
      `Attempted to render a type-only template with a value: ${v}`
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return f(v.type, v.value) as string;
}

// Just a single value
class Single<P extends Primitive> implements Variant {
  public readonly tag = "single";
  public constructor(public type: P, public value?: InferredPrimitive<P>) {}
  public render = (r: Renderer): string =>
    throwIfNeedsValue(this, r.single.bind(r));
}

// A list, all the values are of the same type
class List<P extends Primitive> implements Variant {
  public readonly tag = "list";
  public constructor(public type: P, public value?: InferredPrimitive<P>[]) {}
  public render = (r: Renderer): string =>
    throwIfNeedsValue(this, r.list.bind(r));
}

// A linked list, all the values are of the same type
class LinkedList<P extends Primitive> implements Variant {
  public readonly tag = "linkedList";
  public constructor(public type: P, public value?: InferredPrimitive<P>[]) {}
  public render = (r: Renderer): string =>
    throwIfNeedsValue(this, r.linkedList.bind(r));
}

// A dictionary, all the keys are of the same type, and all the values are of the same type
export type KeyPair<K, V> = { key: K; value: V };
class Dictionary<K extends Primitive, V extends Primitive> implements Variant {
  public readonly tag = "dictionary";
  public constructor(
    public type: KeyPair<K, V>,
    public value?: Map<InferredPrimitive<K>, InferredPrimitive<V>>
  ) {}
  public render = (r: Renderer): string =>
    throwIfNeedsValue(this, r.dictionary.bind(r));
}

// Simple wrapper class to make constructing these easier
export class Type<V extends Variant> {
  // public creation api
  public static single<P extends Primitive>(
    inner: P,
    value?: InferredPrimitive<P>
  ): Type<Single<P>> {
    return new Type(new Single(inner, value));
  }

  public static list<P extends Primitive>(
    inner: P,
    value?: InferredPrimitive<P>[]
  ): Type<List<P>> {
    return new Type(new List(inner, value));
  }

  public static linkedList = <P extends Primitive>(
    inner: P,
    value?: InferredPrimitive<P>[]
  ): Type<LinkedList<P>> => {
    return new Type(new LinkedList(inner, value));
  };

  public static dictionary = <K extends Primitive, V extends Primitive>(
    inner: KeyPair<K, V>,
    value?: Map<InferredPrimitive<K>, InferredPrimitive<V>>
  ): Type<Dictionary<K, V>> => {
    return new Type(new Dictionary(inner, value));
  };

  // this is private to force construction via static apis
  private constructor(private readonly inner: V) {}

  public render(renderer: Renderer): string {
    return this.inner.render(renderer);
  }
}
