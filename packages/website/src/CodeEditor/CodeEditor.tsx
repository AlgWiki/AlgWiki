import * as React from "react";

import { ChallengeFunction, TestCaseType } from "@alg-wiki/types";
import { basicSetup } from "@codemirror/basic-setup";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { Compartment, EditorState, StateField } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import * as monaco from "monaco-editor";

import { countChars } from "../util";
import { CodeMirror } from "./CodeMirror";
import { Monaco } from "./Monaco";
import { isCodeMirrorRequired } from "./utils";

export const CodeEditor: React.FC<{
  desiredEditor?: "monaco" | "codemirror";
  function: ChallengeFunction<TestCaseType[], TestCaseType>;
  initialCode: string;
  onRun?: () => void;
  onChange: (charCount: number) => void;
  getCodeRef: React.MutableRefObject<((code: string) => void) | undefined>;
}> = (props) => {
  const onChangeRef = React.useRef(props.onChange);
  onChangeRef.current = props.onChange;
  const onRunRef = React.useRef(props.onRun);
  onRunRef.current = props.onRun;

  const codeMirrorInit = React.useMemo(
    () => (el: HTMLElement) => {
      const charCounter = StateField.define<number>({
        create(state) {
          const charCount = countChars(state.doc.sliceString(0));
          onChangeRef.current(charCount);
          return charCount;
        },
        update(charCount, tr) {
          tr.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
            for (const str of inserted) charCount += countChars(str);
            charCount -= countChars(tr.startState.sliceDoc(fromA, toA));
          });
          onChangeRef.current(charCount);
          return charCount;
        },
      });
      const lang = new Compartment();
      const editorState = EditorState.create({
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          charCounter,
          lang.of(javascript()),
        ],
        doc: props.initialCode,
      });
      props.getCodeRef.current = () => editorState.doc.sliceString(0);
      return new EditorView({ state: editorState, parent: el });
    },
    []
  );

  const monacoInit = React.useMemo(
    () => (el: HTMLElement) => {
      const editor = monaco.editor.create(el, {
        value: props.initialCode,
        language: "javascript",
        minimap: { enabled: false },
        wordWrap: "on",
      });

      if (props.onRun)
        editor.addAction({
          id: "run-code",
          label: "Run Code",
          keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_R,
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
          ],
          contextMenuGroupId: "navigation",
          contextMenuOrder: 1,
          run() {
            onRunRef.current?.();
          },
        });

      let charCount = countChars(props.initialCode);
      onChangeRef.current(charCount);
      editor.onDidChangeModelContent(() => {
        const model = editor.getModel()!;
        // TODO: Figure out how to get the deleted text so we only count chars in changes
        charCount = countChars(model.getValue());
        // charCount = evt.changes.reduce(
        //   (charCount, change) =>
        //     charCount -
        //     countChars(model.getValueInRange(change.range)) +
        //     countChars(change.text),
        //   charCount
        // );
        onChangeRef.current(charCount);
      });

      props.getCodeRef.current = () => editor.getValue();

      return editor;
    },
    [props.onRun === undefined]
  );

  return props.desiredEditor === "codemirror" ||
    isCodeMirrorRequired("javascript") ? (
    <CodeMirror init={codeMirrorInit} />
  ) : (
    <Monaco height={300} init={monacoInit} />
  );
};
