import ts from "typescript";
import { PartialVisitorContext } from "typescript-is/lib/transform-inline/visitor-context";

import createArrowFunction from "./createArrowFunction";

const ASSERT_TYPE_METHODNAME = "assertType";
const ASSERT_TYPE_MODULENAME = "typescript-is";

interface VisitorContext extends PartialVisitorContext {
  addAssertRequire: boolean;
}

/** Figures out an appropriate human-readable name for the variable designated by `node`. */
function extractVariableName(node: ts.Node | undefined): string {
  return node != null && ts.isIdentifier(node)
    ? node.escapedText.toString()
    : "$";
}

const addAssertRequire = (node: ts.Node): ts.SourceFile => {
  const file = node as ts.SourceFile;
  return ts.updateSourceFileNode(file, [
    ts.createVariableStatement(
      /*modifiers*/ undefined,
      ts.createVariableDeclarationList([
        ts.createVariableDeclaration(
          ts.createObjectBindingPattern(
            /*elements*/ [
              ts.createBindingElement(
                /*dotDotDotToken*/ undefined,
                /*propertyName*/ undefined,
                /*name*/ ASSERT_TYPE_METHODNAME
              ),
            ]
          ),
          /*type*/ undefined,
          ts.createCall(
            ts.createIdentifier("require"),
            [],
            [ts.createLiteral(ASSERT_TYPE_MODULENAME)]
          )
        ),
      ])
    ),
    ...file.statements,
  ]);
};

const makeAssertTypeCall = (
  param: ts.ParameterDeclaration,
  visitorContext: VisitorContext
): ts.ArrowFunction => {
  const typeArgument = param.type as ts.TypeNode;
  const type = visitorContext.checker.getTypeFromTypeNode(typeArgument);
  return createArrowFunction(type, extractVariableName(param.name), false, {
    ...visitorContext,
    options: {
      ...visitorContext.options,
      disallowSuperfluousObjectProperties:
        visitorContext.options.disallowSuperfluousObjectProperties,
    },
  });
};

const transformSourceFile = (
  node: ts.Node,
  visit: ts.Visitor,
  context: ts.TransformationContext,
  visitorContext: VisitorContext
): ts.Node => {
  ts.visitEachChild(node, (child) => visit(child), context);
  if (visitorContext.addAssertRequire) return addAssertRequire(node);
  return node;
};

const transformHandlerFn = (
  node: ts.Node,
  visitorContext: VisitorContext
): ts.MethodDeclaration => {
  visitorContext.addAssertRequire = true;
  const functionDeclaration = node as ts.MethodDeclaration;
  const existingStatements = functionDeclaration.body?.statements || [];
  const typeCheckStatements = functionDeclaration.parameters.map((param) => {
    const arrowFunction: ts.Expression = makeAssertTypeCall(
      param,
      visitorContext
    );
    return ts.createStatement(
      ts.createCall(
        ts.createIdentifier(ASSERT_TYPE_METHODNAME),
        [param.type as ts.TypeNode],
        [ts.createIdentifier((param.name as ts.Identifier).text), arrowFunction]
      )
    );
  });

  (functionDeclaration as { body: ts.FunctionBody }).body = ts.createBlock(
    [...typeCheckStatements, ...existingStatements],
    true
  );
  return functionDeclaration;
};

export default function transformer<T extends ts.Node>(
  program: ts.Program
): ts.TransformerFactory<T> {
  const visitorContext: VisitorContext = {
    program,
    checker: program.getTypeChecker(),
    compilerOptions: program.getCompilerOptions(),
    options: {
      shortCircuit: false,
      ignoreClasses: false,
      ignoreMethods: false,
      functionBehavior: "ignore",
      disallowSuperfluousObjectProperties: false,
    },
    typeMapperStack: [],
    previousTypeReference: null,
    addAssertRequire: false,
  };

  return (context) => {
    const visit: ts.Visitor = (node) => {
      if (ts.isSourceFile(node)) {
        return transformSourceFile(node, visit, context, visitorContext);
      }
      if (
        ts.isFunctionLike(node) &&
        (node.name as ts.Identifier)?.text === "handler" &&
        ((node.parent.parent as ts.NewExpression)?.expression as ts.Identifier)
          .text === "O2Endpoint"
      ) {
        return transformHandlerFn(node, visitorContext);
      }
      return ts.visitEachChild(node, (child) => visit(child), context);
    };

    return (node) => ts.visitNode(node, visit);
  };
}
