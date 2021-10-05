export type AttributeType = "S" | "N";
export type TypeFromAttribute<T extends AttributeType> = T extends "S"
  ? string
  : T extends "N"
  ? number
  : never;
export type AnyAttribute = TypeFromAttribute<AttributeType>;

export interface RuntimeTable {
  name: string;
  attributes: Record<string, AttributeType>;
  index: TableIndex<StringOnly<keyof Record<string, AttributeType>>>;
  globalSecondaryIndexes?: Record<
    string,
    TableIndex<StringOnly<keyof Record<string, AttributeType>>> & {
      projectionType: "ALL" | "INCLUDE" | "KEYS_ONLY";
      nonKeyAttributes?: string[];
    }
  >;
}

export const defineTable = <
  Attrs extends Record<string, AttrType>,
  Index extends TableIndex<StringOnly<keyof Attrs>>,
  AttrType extends AttributeType,
  IncludedAttr extends string,
  Gsis extends Record<
    string,
    TableIndex<StringOnly<keyof Attrs>> & {
      projectionType: "ALL" | "INCLUDE" | "KEYS_ONLY";
      nonKeyAttributes?: IncludedAttr[] & [string];
    }
  > = {}
>(opts: {
  name: string;
  attributes: Attrs;
  index: Index;
  globalSecondaryIndexes?: Gsis;
}): {
  __type: DbTable<
    {
      [K in keyof Attrs]: TypeFromAttribute<Attrs[K]>;
    },
    Index,
    {
      [K in keyof Gsis]: {
        hashKey: Gsis[K]["hashKey"];
        rangeKey: Gsis[K]["rangeKey"];
        attributes:
          | Index["hashKey"]
          | Index["rangeKey"]
          | Gsis[K]["hashKey"]
          | Gsis[K]["rangeKey"]
          | (Gsis[K]["projectionType"] extends "ALL"
              ? string
              : Gsis[K]["projectionType"] extends "INCLUDE"
              ? Gsis[K]["nonKeyAttributes"] extends string[]
                ? Gsis[K]["nonKeyAttributes"][number]
                : never
              : never);
      };
    }
  >;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
} & typeof opts => opts as any;

export type DbTable<
  Attrs extends Record<string, string | number>,
  Index extends TableIndex<StringOnly<keyof Attrs>>,
  Gsis extends Record<
    string,
    TableIndex<StringOnly<keyof Attrs>> & { attributes: string }
  >
> = {
  attrs: Attrs;
  index: Index;
  globalSecondaryIndexes: Gsis;
};

export type AnyDbTable = DbTable<
  Record<string, string | number>,
  TableIndex<string>,
  Record<string, TableIndex<string> & { attributes: string }>
>;

export type TableIndex<Attr extends string> = {
  hashKey: Attr;
  rangeKey: Attr;
};

export type TableKeys<Table extends AnyDbTable> = Pick<
  Table["attrs"],
  Table["index"]["hashKey" | "rangeKey"]
>;

type StringOnly<T> = T extends string ? T : never;
