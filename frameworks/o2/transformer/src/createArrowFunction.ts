import ts from "typescript";
import { sliceMapValues } from "typescript-is/lib/transform-inline/utils";
import {
  PartialVisitorContext,
  VisitorContext,
} from "typescript-is/lib/transform-inline/visitor-context";
import {
  visitShortCircuit,
  visitType,
  visitUndefinedOrType,
} from "typescript-is/lib/transform-inline/visitor-type-check";
import * as VisitorUtils from "typescript-is/lib/transform-inline/visitor-utils";

export default function createArrowFunction(
  type: ts.Type,
  rootName: string,
  optional: boolean,
  partialVisitorContext: PartialVisitorContext
): ts.ArrowFunction {
  const functionMap: VisitorContext["functionMap"] =
    new Map() as VisitorContext["functionMap"];
  const functionNames: VisitorContext["functionNames"] = new Set();
  const visitorContext = {
    ...partialVisitorContext,
    functionNames,
    functionMap,
  };
  const functionName = partialVisitorContext.options.shortCircuit
    ? visitShortCircuit(visitorContext)
    : optional
    ? visitUndefinedOrType(type, visitorContext)
    : visitType(type, visitorContext);

  // TODO: Fix all deprecations in this file
  const errorIdentifier = ts.createIdentifier("error");
  const declarations = sliceMapValues(functionMap);

  return ts.createArrowFunction(
    undefined,
    undefined,
    [
      ts.createParameter(
        undefined,
        undefined,
        undefined,
        VisitorUtils.objectIdentifier,
        undefined,
        ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
      ),
    ],
    undefined,
    undefined,
    ts.createBlock([
      ts.createVariableStatement(
        [ts.createModifier(ts.SyntaxKind.ConstKeyword)],
        [
          ts.createVariableDeclaration(
            VisitorUtils.pathIdentifier,
            undefined,
            ts.createArrayLiteral([ts.createStringLiteral(rootName)])
          ),
        ]
      ),
      ...declarations,
      ts.createVariableStatement(
        [ts.createModifier(ts.SyntaxKind.ConstKeyword)],
        [
          ts.createVariableDeclaration(
            errorIdentifier,
            undefined,
            ts.createCall(ts.createIdentifier(functionName), undefined, [
              VisitorUtils.objectIdentifier,
            ])
          ),
        ]
      ),
      ts.createReturn(errorIdentifier),
    ])
  );
}
