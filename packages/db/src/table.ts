import { defineTable } from "./util";

export const table = defineTable({
  name: "main",
  attributes: {
    pk0: "S",
    pk1: "S",
    pk2: "S",
    pk3: "S",
    sk0: "N",
    sk1: "N",
  },
  index: {
    hashKey: "pk0",
    rangeKey: "sk0",
  },
  globalSecondaryIndexes: {
    gsi1: {
      hashKey: "pk1",
      rangeKey: "sk0",
      projectionType: "INCLUDE",
      nonKeyAttributes: ["name"],
    },
    gsi2: {
      hashKey: "pk2",
      rangeKey: "sk1",
      projectionType: "INCLUDE",
      nonKeyAttributes: ["pk1"],
    },
    gsi3: {
      hashKey: "pk3",
      rangeKey: "sk1",
      projectionType: "INCLUDE",
      nonKeyAttributes: ["pk1"],
    },
  },
});

export type Table = typeof table["__type"];
