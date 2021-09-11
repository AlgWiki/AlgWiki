import * as React from "react";

import * as monaco from "monaco-editor";

import { countChars } from "../util";
import { EditorApi } from "./types";

export const setupMonacoEnvironment = (): void => {
  (self as Window &
    typeof globalThis & {
      MonacoEnvironment: monaco.Environment;
    }).MonacoEnvironment = {
    getWorkerUrl(_moduleId, label) {
      switch (label) {
        case "typescript":
        case "javascript":
          return "./monaco-workers/ts.worker.js";
        default:
          return "./monaco-workers/editor.worker.js";
      }
    },
  };
};

export const Monaco: React.FC<{
  initialCode: string;
  onChange: (charCount: number) => void;
  apiRef: React.MutableRefObject<EditorApi | undefined>;
}> = (props) => {
  const divRef = React.useRef<HTMLDivElement>();
  const onChangeRef = React.useRef(props.onChange);
  onChangeRef.current = props.onChange;
  const [editor, setEditor] = React.useState<
    monaco.editor.IStandaloneCodeEditor | undefined
  >();
  React.useEffect(() => {
    props.apiRef.current = {
      getCode: () => editor?.getValue() ?? props.initialCode,
    };
  }, [props.apiRef]);
  return (
    <div
      style={{ height: 500 }}
      ref={(el) => {
        if (!el || el === divRef.current) return;
        divRef.current = el;
        setupMonacoEnvironment();
        const monacoEl = document.createElement("div");
        monacoEl.style.position = "relative";
        monacoEl.style.width = "600px";
        monacoEl.style.height = "400px";
        el.appendChild(monacoEl);
        const editor = monaco.editor.create(monacoEl, {
          value: props.initialCode,
          language: "javascript",
        });
        editor.onDidChangeModelContent((evt) => {
          const model = editor.getModel()!;
          props.onChange(
            evt.changes.reduce(
              (charCount, change) =>
                charCount -
                countChars(model.getValueInRange(change.range)) +
                countChars(change.text),
              0
            )
          );
        });
        props.onChange(countChars(props.initialCode));
        setEditor(editor);
      }}
    />
  );
};
