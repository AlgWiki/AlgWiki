declare module "json-schema-to-openapi-schema" {
  import { SchemaObject } from "openapi3-ts";
  import * as tsj from "ts-json-schema-generator";

  export default function convert(
    schema: tsj.Schema,
    options?: { cloneSchema: boolean }
  ): SchemaObject;
}
