import * as React from "react";

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
  initialCode: string;
  onChange: (charCount: number) => void;
  getCodeRef: React.MutableRefObject<((code: string) => void) | undefined>;
}> = (props) => {
  const onChangeRef = React.useRef(props.onChange);
  onChangeRef.current = props.onChange;

  if (
    props.desiredEditor === "codemirror" ||
    isCodeMirrorRequired("javascript")
  )
    return (
      <CodeMirror
        {...props}
        init={(el) => {
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
          return new EditorView({ state: editorState, parent: el });
        }}
      />
    );

  return (
    <Monaco
      {...props}
      init={(el) => {
        const editor = monaco.editor.create(el, {
          value: props.initialCode,
          language: "javascript",
          minimap: { enabled: false },
          wordWrap: "on",
        });

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
            console.log("RUN");
          },
        });

        editor.addAction({
          id: "save-code",
          label: "Save Code",
          keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
          run() {
            console.log("SAVE");
          },
        });

        let charCount = countChars(props.initialCode);
        onChangeRef.current(charCount);
        editor.onDidChangeModelContent((evt) => {
          const model = editor.getModel()!;
          charCount = evt.changes.reduce(
            (charCount, change) =>
              charCount -
              countChars(model.getValueInRange(change.range)) +
              countChars(change.text),
            charCount
          );
          onChangeRef.current(charCount);
        });

        return editor;
      }}
    />
  );
};
