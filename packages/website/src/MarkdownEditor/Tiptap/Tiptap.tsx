import * as React from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import "./Tiptap.scss";
import { EditorMenu } from "./EditorMenu";

export interface Props {
  content: string;
}

export const Tiptap: React.FC<Props> = ({ content }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
  });

  return (
    <div className="MarkdownEditor">
      <EditorMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
