import * as React from "react";

import { basicSetup } from "@codemirror/basic-setup";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState, StateField } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import * as prettier from "prettier";

import { CodeMirror } from "../CodeEditor/CodeMirror";
import { countChars } from "../util";

export interface TestCase<
  Input extends TestCaseType[],
  Output extends TestCaseType
> {
  input: InputDef<Input>;
  expected: Output;
}
type TestCasePrimitive = null | boolean | number | string;
type TestCaseLinkedList<T> = { value: T; next: TestCaseLinkedList<T> | null };
type TestCaseType =
  | TestCasePrimitive
  | TestCasePrimitive[]
  | TestCaseLinkedList<TestCasePrimitive>
  | Map<TestCasePrimitive, TestCasePrimitive>;
type InputDef<Input extends TestCaseType[]> = {
  [K in keyof Input]: K extends number ? InputDefArg<Input[K]>[] : never;
};
type InputDefArg<Arg extends TestCaseType> =
  | (Arg extends null ? { type: "null" } : never)
  | (Arg extends boolean ? { type: "boolean" } : never)
  | (Arg extends number ? { type: "number" } : never)
  | (Arg extends string ? { type: "string" } : never)
  | (Arg extends Array<infer Value>
      ? Value extends TestCaseType
        ? { type: "array"; value: InputDefArg<Value> }
        : never
      : never)
  | (Arg extends TestCaseLinkedList<infer Value>
      ? Value extends TestCaseType
        ? { type: "linkedList"; value: InputDefArg<Value> }
        : never
      : never)
  | (Arg extends Map<infer Key, infer Value>
      ? Key extends TestCaseType
        ? Value extends TestCaseType
          ? {
              type: "linkedList";
              key: InputDefArg<Key>;
              value: InputDefArg<Value>;
            }
          : never
        : never
      : never);

export const TestCases: React.FC<{
  isEditable?: boolean;
  onChange?: () => void;
  functionName: string;
  testCases: TestCase<TestCaseType[], TestCaseType>[];
}> = (props) => {
  const onChangeRef = React.useRef(props.onChange);
  onChangeRef.current = props.onChange;

  return (
    <CodeMirror
      init={(el) => {
        const charCounter = StateField.define<number>({
          create(state) {
            const charCount = countChars(state.doc.sliceString(0));
            onChangeRef.current?.();
            return charCount;
          },
          update(charCount, tr) {
            tr.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
              for (const str of inserted) charCount += countChars(str);
              charCount -= countChars(tr.startState.sliceDoc(fromA, toA));
            });
            onChangeRef.current?.();
            return charCount;
          },
        });
        const editorState = EditorState.create({
          extensions: [
            basicSetup,
            keymap.of([indentWithTab]),
            charCounter,
            javascript(),
          ],
          doc: prettier.format(
            props.testCases
              .map(
                (testCase) =>
                  `${props.functionName}(${JSON.stringify(
                    testCase.input
                  ).substring(1, -1)})`
              )
              .join("\n\n"),
            { parser: "typescript" }
          ),
        });
        return new EditorView({ state: editorState, parent: el });
      }}
    />
  );
};
