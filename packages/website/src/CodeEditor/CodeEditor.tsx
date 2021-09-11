import * as React from "react";

import { CodeMirror } from "./CodeMirror";
import { Monaco } from "./Monaco";
import { EditorApi } from "./types";

export const CodeEditor: React.FC<{
  initialCode: string;
  onChange: (charCount: number) => void;
  apiRef: React.MutableRefObject<EditorApi | undefined>;
}> = (props) => {
  const isMobile = false;
  const isLanguageSupported = true;
  const EditorComponent =
    !isMobile && isLanguageSupported ? Monaco : CodeMirror;
  return <EditorComponent {...props} />;
};
