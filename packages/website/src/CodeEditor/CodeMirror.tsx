import * as React from "react";

import { EditorView } from "@codemirror/view";

export const CodeMirror: React.FC<{
  init: (el: HTMLElement) => EditorView;
}> = (props) => {
  const divRef = React.useCallback((el: HTMLDivElement) => {
    if (!el) return;
    while (el.firstChild) el.firstChild.remove();
    props.init(el);
  }, []);
  return <div ref={divRef} />;
};
