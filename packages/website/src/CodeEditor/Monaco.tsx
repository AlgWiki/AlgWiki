import * as React from "react";

import * as monaco from "monaco-editor";

export const Monaco: React.FC<{
  height?: number;
  init: (el: HTMLElement) => monaco.editor.IEditor;
}> = (props) => {
  const divRef = React.useCallback(
    (el: HTMLDivElement) => {
      if (!el) return;
      while (el.firstChild) el.firstChild.remove();
      const monacoEl = document.createElement("div");
      monacoEl.style.position = "relative";
      if (props.height) monacoEl.style.height = `${props.height}px`;
      new ResizeObserver(() => editor.layout()).observe(monacoEl);
      el.appendChild(monacoEl);

      const editor = props.init(monacoEl);
    },
    [props.init]
  );

  return <div style={{ height: props.height }} ref={divRef} />;
};
