import { DynamoDB } from "aws-sdk";

import { AnyAttribute, AnyDbTable, AttributeType, RuntimeTable } from "./table";

type GetIndex<
  Table extends AnyDbTable,
  IndexName extends
    | keyof Table["globalSecondaryIndexes"]
    | undefined = undefined
> = IndexName extends keyof Table["globalSecondaryIndexes"]
  ? Table["globalSecondaryIndexes"][IndexName]
  : Table["index"];

interface Condition {
  key: string;
  condition: string;
  var: { key: string; name: string; type: AttributeType; value: unknown };
}

type ConditionDef<T> = T | { beginsWith: T };

export const query = <RecordType>() =>
  async function* query<
    Table extends AnyDbTable,
    IndexName extends
      | keyof Table["globalSecondaryIndexes"]
      | undefined = undefined,
    FilterKey extends Exclude<
      keyof Table["attrs"],
      | GetIndex<Table, IndexName>["hashKey"]
      | GetIndex<Table, IndexName>["rangeKey"]
    > = never
  >(opts: {
    db: DynamoDB.DocumentClient;
    table: RuntimeTable & { __type: Table };
    index?: IndexName;
    key: Record<
      GetIndex<Table, IndexName>["hashKey"],
      Table["attrs"][GetIndex<Table, IndexName>["hashKey"]]
    > &
      Partial<
        Record<
          GetIndex<Table, IndexName>["rangeKey"],
          ConditionDef<Table["attrs"][GetIndex<Table, IndexName>["rangeKey"]]>
        >
      >;
    filter?: { [K in FilterKey]: ConditionDef<Table["attrs"][K]> };
    startKey?: DynamoDB.DocumentClient.Key;
    limit: number;
  }): AsyncGenerator<
    IndexName extends keyof Table["globalSecondaryIndexes"]
      ? Pick<
          RecordType,
          keyof RecordType &
            Table["globalSecondaryIndexes"][IndexName]["attributes"]
        >
      : RecordType
  > {
    const createCondition = (
      varPrefix: string,
      key: string,
      value: ConditionDef<AnyAttribute>,
      i: number
    ): Condition => {
      const varName = `:${varPrefix}${i}`;

      if (typeof value === "object" && value !== null) {
        return {
          key,
          condition: `begins_with(${key}, ${varName})`,
          var: {
            key: `#${varPrefix}${i}`,
            name: varName,
            type: opts.table.attributes[key],
            value: value.beginsWith,
          },
        };
      }

      return {
        key,
        condition: `${key} = ${varName}`,
        var: {
          key: `#${varPrefix}${i}`,
          name: varName,
          type: opts.table.attributes[key],
          value,
        },
      };
    };
    const keyConditions: Condition[] = Object.entries(opts.key).map(
      ([key, value], i) =>
        createCondition("k", key, value as ConditionDef<AnyAttribute>, i)
    );
    const filterConditions: Condition[] = opts.filter
      ? Object.entries(opts.filter).map(([key, value], i) =>
          createCondition("f", key, value as ConditionDef<AnyAttribute>, i)
        )
      : [];
    const allConditions = [...keyConditions, ...filterConditions];

    let lastKey: DynamoDB.DocumentClient.Key | undefined = opts.startKey;
    let remainingLimit = opts.limit;
    do {
      const result = await opts.db
        .query({
          TableName: opts.table.name,
          Limit: remainingLimit,
          ExclusiveStartKey: lastKey,
          IndexName: opts.index as string | undefined,
          ExpressionAttributeNames: Object.fromEntries(
            allConditions.map((condition) => [condition.var.key, condition.key])
          ),
          ExpressionAttributeValues: Object.fromEntries(
            allConditions.map((condition) => [
              condition.var.name,
              { [condition.var.type]: condition.var.value },
            ])
          ),
          KeyConditionExpression: keyConditions
            .map(({ condition }) => condition)
            .join(" AND "),
          FilterExpression: opts.filter && filterConditions.join(" AND "),
        })
        .promise();
      const items = result.Items ?? [];
      for (const item of items) yield item as any;
      lastKey = result.LastEvaluatedKey;
      remainingLimit -= items.length;
    } while (lastKey);
  };

export const getRecord = <RecordType>() =>
  async function get<Table extends AnyDbTable>(opts: {
    db: DynamoDB.DocumentClient;
    table: RuntimeTable & { __type: Table };
    key: Pick<Table["attrs"], Table["index"]["hashKey" | "rangeKey"]>;
  }): Promise<RecordType | undefined> {
    const result = await opts.db
      .get({
        TableName: opts.table.name,
        Key: Object.fromEntries(
          Object.entries(opts.key).map(([name, value]) => [
            name,
            { [opts.table.attributes[name]]: value },
          ])
        ),
      })
      .promise();
    return result.Item as RecordType | undefined;
  };
