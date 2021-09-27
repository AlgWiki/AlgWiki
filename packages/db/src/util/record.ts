import { AnyDbTable } from "./table";

export interface DbRecordType<Id extends string, Value, RecordType> {
  name: string;
  isId: (id: string) => id is Id;
  toRecord: (value: Value) => RecordType;
  fromRecord: (record: RecordType & { pk0: Id }) => Value;
}
export const defineRecordType = <Id extends string, Value, RecordType>(
  opts: DbRecordType<Id, Value, RecordType>
): DbRecordType<Id, Value, RecordType> => ({
  ...opts,
  fromRecord(record) {
    if (!opts.isId(record.pk0))
      throw new Error(
        `Cannot create ${opts.name} from record because it does not have a ${opts.name} ID`
      );
    return opts.fromRecord(record);
  },
});

export type Language = "javascript";

export type DbRecord<
  Table extends AnyDbTable,
  Idx extends keyof Table["globalSecondaryIndexes"] | null,
  Data
> = {
  [K in
    | Table["index"]["hashKey"]
    | Table["index"]["rangeKey"]]: Table["attrs"][K];
} & (Idx extends keyof Table["globalSecondaryIndexes"]
  ? string extends Table["globalSecondaryIndexes"][Idx]["attributes"]
    ? {}
    : {
        [K in
          | Table["globalSecondaryIndexes"][Idx]["hashKey"]
          | Table["globalSecondaryIndexes"][Idx]["rangeKey"]]: Table["attrs"][K];
      }
  : {}) &
  (Idx extends keyof Table["globalSecondaryIndexes"]
    ? {
        [K in Extract<
          keyof Data,
          Table["globalSecondaryIndexes"][Idx]["attributes"]
        >]: Data[K];
      }
    : Data);
