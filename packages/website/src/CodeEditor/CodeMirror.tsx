import * as React from "react";

import { EditorView } from "@codemirror/view";

export const CodeMirror: React.FC<{
  init: (el: HTMLElement) => EditorView;
}> = (props) => {
  const divRef = React.useCallback((el) => {
    if (!el) return;
    props.init(el);
  }, []);
  return <div ref={divRef} />;
};
