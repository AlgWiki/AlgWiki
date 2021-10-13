import * as React from "react";

import {
  ArgType,
  ChallengeFunction,
  OutputStream,
  TestCase,
  TestCaseRuns,
  TestCaseType,
} from "@algwiki/types";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";
import * as monaco from "monaco-editor";
import parserBabel from "prettier/parser-babel";
import * as prettier from "prettier/standalone";

import { Monaco } from "../CodeEditor/Monaco";

const prettify = (code: string): string => {
  try {
    return prettier.format(code, {
      plugins: [parserBabel],
      parser: "babel-ts",
    });
  } catch (err) {
    console.error(err);
    return code;
  }
};

const MONACO_OPTIONS: monaco.editor.IEditorOptions = {
  minimap: { enabled: false },
  wordWrap: "on",
  readOnly: true,
  scrollBeyondLastLine: false,
  automaticLayout: true,
};

export const TestCases: React.FC<{
  isEditable?: boolean;
  onChange?: () => void;
  function: ChallengeFunction<TestCaseType[], TestCaseType>;
  testCases: TestCase<TestCaseType[], TestCaseType>[];
  lastRun?: TestCaseRuns;
}> = (props) => (
  <>
    {props.lastRun?.error && (
      <div style={{ background: "#ff9", color: "#650" }}>
        <WarningIcon /> {props.lastRun.error}
      </div>
    )}
    {props.testCases.map((testCase) => (
      <TestCaseDisplay
        key={testCase.hash}
        function={props.function}
        testCase={testCase}
        lastRun={props.lastRun?.tests[testCase.hash]}
      />
    ))}
  </>
);

export const TestCaseDisplay: React.FC<{
  function: ChallengeFunction<TestCaseType[], TestCaseType>;
  testCase: TestCase<TestCaseType[], TestCaseType>;
  lastRun?: TestCaseRuns["tests"][string];
}> = (props) => {
  const init = React.useMemo(
    () => (el: HTMLElement) => {
      const expected = prettify(
        `function ${props.function.name}(${props.testCase.input
          .map(
            (arg, i) =>
              `${props.function.input[i].name}: ${JSON.stringify(arg)}`
          )
          .join(",")}): ${JSON.stringify(props.testCase.expected)}`
      )
        .replace("function ", "")
        .trim();

      if (!props.lastRun) {
        const editor = monaco.editor.create(el, {
          ...MONACO_OPTIONS,
          language: "typescript",
          value: expected,
        });

        let ignoreEvent = false;
        const updateHeight = (): void => {
          if (ignoreEvent) return;
          const height = Math.min(300, editor.getContentHeight());
          el.style.height = `${height}px`;
          try {
            ignoreEvent = true;
            editor.layout();
          } finally {
            ignoreEvent = false;
          }
        };
        editor.onDidContentSizeChange(updateHeight);
        updateHeight();

        addOutputTitleOverlay(editor, "Expected output");

        return editor;
      }

      const actual = prettify(
        `function ${props.function.name}(${props.testCase.input
          .map(
            (arg, i) =>
              `${props.function.input[i].name}: ${JSON.stringify(arg)}`
          )
          .join(",")}): ${JSON.stringify(props.lastRun.result)}`
      )
        .replace("function", "")
        .trim();
      const modelExpected = monaco.editor.createModel(expected, "typescript");
      const modelActual = monaco.editor.createModel(actual, "typescript");
      const diffEditor = monaco.editor.createDiffEditor(el, MONACO_OPTIONS);
      diffEditor.setModel({
        original: modelExpected,
        modified: modelActual,
      });

      const originalEditor = diffEditor.getOriginalEditor();
      const modifiedEditor = diffEditor.getModifiedEditor();
      let ignoreEvent = false;
      const updateHeight = (): void => {
        if (ignoreEvent) return;
        const height = Math.min(
          300,
          Math.max(
            originalEditor.getContentHeight(),
            modifiedEditor.getContentHeight()
          )
        );
        el.style.height = `${height}px`;
        try {
          ignoreEvent = true;
          diffEditor.layout();
        } finally {
          ignoreEvent = false;
        }
      };
      diffEditor.getOriginalEditor().onDidContentSizeChange(updateHeight);
      diffEditor.getModifiedEditor().onDidContentSizeChange(updateHeight);
      updateHeight();

      addOutputTitleOverlay(originalEditor, "Expected output");
      addOutputTitleOverlay(modifiedEditor, "Last run output");

      return diffEditor;
    },
    [props.function, props.testCase, props.lastRun]
  );
  // TODO: Implement split diff view in CM or wait for merge add-on to work in CM6
  return (
    <>
      {props.lastRun && (
        <>
          {props.lastRun.error && (
            <div style={{ background: "#ffee75", color: "#650" }}>
              <WarningIcon /> {props.lastRun.error}
            </div>
          )}
          {props.lastRun.result !== undefined &&
            (judgeIsCorrect(
              props.function.output,
              props.testCase.expected,
              props.lastRun.result
            ) ? (
              <div style={{ color: "green" }}>
                <CheckCircleIcon /> Correct
              </div>
            ) : (
              <div style={{ color: "darkred" }}>
                <CancelIcon /> Incorrect
              </div>
            ))}
        </>
      )}
      <Monaco init={init} />
      {props.lastRun && (
        <>
          <h4>Console output</h4>
          <pre style={{ background: "#ccc", padding: 16 }}>
            {props.lastRun.output.map(([stream, text], i) => (
              <span
                key={i}
                style={{
                  color: stream === OutputStream.STDERR ? "darkred" : undefined,
                }}
              >
                {text}
              </span>
            ))}
          </pre>
        </>
      )}
    </>
  );
};

const addOutputTitleOverlay = (
  editor: monaco.editor.ICodeEditor,
  title: string
): void => {
  const titleEl = document.createElement("h4");
  titleEl.style.cssText = `
    position: absolute;
    top: 0;
    right: 14px;
    margin: 0;
    padding: 8px 16px 8px 16px;
    pointer-events: none;
    background: rgba(200, 200, 200, 0.6);
  `;
  titleEl.textContent = title;
  editor.addOverlayWidget({
    getId: () => "modifiedEditor",
    getDomNode: () => titleEl,
    getPosition: () => null,
  });
};

const EPSILON = 1e-9;

// Judgement philosophy:
// - Be somewhat lenient with matching types (some langs don't support some types,
//   may not have necessary precision or the required format may be overly verbose)
function judgeIsCorrect<T extends TestCaseType>(
  type: ArgType<T>,
  expected: T,
  result: unknown
): boolean {
  try {
    switch (type.type) {
      case "null":
        return result === null;
      case "boolean":
        return expected
          ? result === true ||
              (typeof result === "number" && (result > 0 || result < 0))
          : result === false || result === 0 || result === null;
      case "integer": {
        if (
          typeof result !== "number" &&
          (typeof result !== "string" || !/^\s*0[a-z]/.test(result.trim()))
        )
          return false;
        // TODO: Update TS
        return BigInt(result) === (expected as unknown as BigInt);
      }
      case "float": {
        const resultNum =
          typeof result === "number"
            ? result
            : typeof result === "string"
            ? parseFloat(result)
            : NaN;
        return (
          !isNaN(resultNum) &&
          (expected as number) + EPSILON >= resultNum &&
          (expected as number) - EPSILON <= resultNum
        );
      }
      case "string":
        return (
          (typeof result === "string" ||
            typeof result === "number" ||
            typeof result === "bigint" ||
            typeof result === "boolean") &&
          String(result) === expected
        );
      case "array":
        return (
          Array.isArray(result) &&
          (expected as unknown[]).length === result.length &&
          (expected as unknown[]).every((value, i) =>
            judgeIsCorrect(type.value, value as any, result[i])
          )
        );
    }
  } catch {}
  return false;
}
