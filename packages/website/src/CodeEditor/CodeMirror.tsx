import * as React from "react";

import { basicSetup } from "@codemirror/basic-setup";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { Compartment, EditorState, StateField } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";

import { countChars } from "../util";
import { EditorApi } from "./types";

export const CodeMirror: React.FC<{
  initialCode: string;
  onChange: (charCount: number) => void;
  apiRef: React.MutableRefObject<EditorApi | undefined>;
}> = (props) => {
  const divRef = React.useRef<HTMLDivElement>();
  const onChangeRef = React.useRef(props.onChange);
  onChangeRef.current = props.onChange;
  const { editor, charCounter } = React.useMemo(() => {
    const charCounter = StateField.define<number>({
      create(state) {
        const charCount = countChars(state.doc.sliceString(0));
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
    return { editor: new EditorView({ state: editorState }), charCounter };
  }, []);
  React.useEffect(() => {
    props.apiRef.current = { getCode: () => editor.state.doc.sliceString(0) };
  }, [props.apiRef]);
  React.useEffect(() => {
    props.onChange(editor.state.field(charCounter));
  }, []);
  return (
    <div
      ref={(el) => {
        if (!el || el === divRef.current) return;
        editor.dom.remove();
        el.appendChild(editor.dom);
        divRef.current = el;
      }}
    />
  );
};
