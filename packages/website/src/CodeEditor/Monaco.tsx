import * as React from "react";

import * as monaco from "monaco-editor";

export const Monaco: React.FC<{
  init: (el: HTMLElement) => monaco.editor.IStandaloneCodeEditor;
}> = (props) => {
  const divRef = React.useCallback((el: HTMLDivElement) => {
    if (!el) return;
    const monacoEl = document.createElement("div");
    monacoEl.style.position = "relative";
    monacoEl.style.width = monacoEl.style.height = "100%";
    new ResizeObserver(() => editor.layout()).observe(monacoEl);
    el.appendChild(monacoEl);

    const editor = props.init(monacoEl);
  }, []);

  return <div style={{ height: 500 }} ref={divRef} />;
};
