/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JsonData,
  NonReadonly,
  replaceDefinitionRefsWithComponents,
} from "@oxy2/utils";
import toOpenApi from "json-schema-to-openapi-schema";
import type { SchemaObject, SchemasObject } from "openapi3-ts";
import * as tsj from "ts-json-schema-generator";
import ts from "typescript";

// Required because only this file is imported when used as a transformer plugin
// which means we don't get the types for `json-schema-to-openapi-schema` declared
import "./types";

const valueToAst = (value: JsonData): ts.Expression => {
  switch (typeof value) {
    case "boolean":
      return value ? ts.createTrue() : ts.createFalse();
    case "number":
      return ts.createNumericLiteral(String(value));
    case "string":
      return ts.createStringLiteral(value);
    case "object":
      return !value
        ? ts.createNull()
        : Array.isArray(value)
        ? ts.createArrayLiteral(value.map(valueToAst))
        : ts.createObjectLiteral(
            Object.entries(value).map(([k, v]) =>
              ts.createPropertyAssignment(
                ts.createStringLiteral(k),
                valueToAst(v)
              )
            )
          );
    default:
      throw new Error(`Unknown value type: ${typeof value}`);
  }
};

const transformer =
  (
    program: ts.Program,
    _config?: Record<string, never>
  ): ts.TransformerFactory<ts.SourceFile> =>
  (context) => {
    const checker = program.getTypeChecker();
    const tsjConfig: tsj.Config = {};
    const parser = tsj.createParser(program as any, tsjConfig);
    const formatter = tsj.createFormatter(tsjConfig);
    const generator = new tsj.SchemaGenerator(
      program as any,
      parser,
      formatter
    );

    return (sourceFile) => {
      const visitor: ts.Visitor = (node) => {
        if (ts.isNewExpression(node)) {
          const type = checker.getTypeAtLocation(node);
          const isO2Endpoint = type.symbol?.escapedName === "O2Endpoint";
          if (isO2Endpoint) {
            const bail = (msg: string): ts.NewExpression => {
              console.error(msg + " so OpenAPI cannot be inferred");
              return ts.visitEachChild(node, visitor, context);
            };

            const getOpenapiSchemaForType = (
              type: ts.Type,
              crashOnError: boolean
            ): { schema: SchemaObject; schemas: SchemasObject } => {
              // ts-json-schema-generator requires a `ts.Node` rather than just a `ts.Type`
              // We can get the nodes this way but it still fails because it doesn't support all nodes
              // TODO: Fix by supporting all nodes or switching libraries
              //       (CrossType looks promising...)
              const declarations = type.symbol?.getDeclarations();
              if (!declarations) return { schema: {}, schemas: {} };
              try {
                const jsonSchema = generator.createSchemaFromNodes(
                  declarations as any
                );
                const { definitions = {}, ...otherProps } = jsonSchema;
                const result: { schema: SchemaObject; schemas: SchemasObject } =
                  {
                    schema: toOpenApi(otherProps),
                    schemas: Object.fromEntries(
                      Object.entries(definitions)
                        .filter(
                          (entry): entry is [string, tsj.Schema] =>
                            typeof entry[1] === "object"
                        )
                        .map(([name, def]) => [name, toOpenApi(def)])
                    ),
                  };
                replaceDefinitionRefsWithComponents(result.schema);
                replaceDefinitionRefsWithComponents(result.schemas);
                return result;
              } catch (err) {
                // TODO: All errors should crash compilation but since only response types tend to
                //       crash and they are not critical to running the service we silence them here
                if (!crashOnError) return { schema: {}, schemas: {} };

                console.error(err);
                throw new Error(
                  `Error generating O2Endpoint OpenAPI schema: ${err}`
                );
              }
            };

            const [input, output] =
              (type as ts.TypeReference).typeArguments || [];
            if (!input || !output)
              return bail("O2Endpoint is missing generic arguments");
            const openapiInput = getOpenapiSchemaForType(input, true);
            const openapiOutput = getOpenapiSchemaForType(output, false);
            const endpointOpenapi = {
              operation: {
                requestBody: {
                  description: "Request input.",
                  content: {
                    "application/json": {
                      schema: openapiInput.schema,
                    },
                  },
                },
                responses: {
                  "200": {
                    description: "Successful response.",
                    content: {
                      "application/json": {
                        schema: openapiOutput.schema,
                      },
                    },
                  },
                },
              },
              schemas: {
                ...openapiInput.schemas,
                ...openapiOutput.schemas,
              },
            };

            const cloned = ts.getMutableClone(node);
            (cloned as NonReadonly<typeof cloned>).arguments =
              node.arguments &&
              ts.createNodeArray(
                node.arguments.map((arg, i) =>
                  i === 0
                    ? ts.createObjectLiteral(
                        [
                          ts.createPropertyAssignment(
                            ts.createIdentifier("openapi"),
                            valueToAst(endpointOpenapi)
                          ),
                          ts.createSpreadAssignment(arg),
                        ],
                        true
                      )
                    : arg
                )
              );
            return cloned;
          }

          //   if (isO2Endpoint) {
          //     const arg = node.arguments?.[0];
          //     if (arg) argsToAddO2EndpointTypeInfo.add(arg);
          //   }
          // } else if (argsToAddO2EndpointTypeInfo.has(node as ts.Expression)) {
          //   const handler = checker.getTypeAtLocation(node).getProperty('handler');
          //   if (handler && ts.isPropertySignature(handler) && handler.type) {
          //     // const handlerType = checker.getTypeAtLocation(handler);
          //     console.log(checker.getTypeFromTypeNode(handler.valueDeclaration.type));
          //     return ts.createCall(ts.createIdentifier('addO2EndpointTypeInfo'), [], [node as ts.Expression]);
          //   }
        }

        return ts.visitEachChild(node, visitor, context);
      };

      return ts.visitNode(sourceFile, visitor);
    };
  };

export default transformer;
// export { transformer };
