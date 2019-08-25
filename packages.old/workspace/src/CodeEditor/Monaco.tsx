import React, { Component } from 'react';
import MonacoEditor, { EditorDidMount } from 'react-monaco-editor';
import { editor } from 'monaco-editor';
import SizeDetector from '@atlaskit/size-detector';

declare global {
  interface Window {
    MonacoEnvironment: any;
  }
}

window.MonacoEnvironment = {
  baseUrl: '/monaco-editor',
  getWorkerUrl(_moduleId: string, label: string) {
    switch (label) {
      case 'json':
        return '_next/static/monaco/json.worker.js';
      case 'css':
        return '_next/static/monaco/css.worker.js';
      case 'html':
        return '_next/static/monaco/html.worker.js';
      case 'typescript':
      case 'javascript':
        return '_next/static/monaco/typescript.worker.js';
      default:
        return '_next/static/monaco/editor.worker.js';
    }
  },
};

export interface Props {
  defaultValue: string;
  onRun: () => void;
  onSave: () => void;
}
export default class Monaco extends Component<Props> {
  editor: editor.IStandaloneCodeEditor;
  monaco: typeof import('monaco-editor/esm/vs/editor/editor.api');

  editorDidMount: EditorDidMount = (editor, monaco) => {
    const { onRun, onSave } = this.props;
    this.editor = editor;
    this.monaco = monaco;

    // Prevent page scrolling when reaching the end of the editor on scroll
    // editor.getDomNode()!.addEventListener('wheel', e => {
    //   e.preventDefault();
    // });

    // Add 'Run Code' action
    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_R,
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      ],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1,
      run() {
        onRun();
        console.log('RUN');
      },
    });

    // Add 'Save Code' action
    editor.addAction({
      id: 'save-code',
      label: 'Save Code',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.1,
      run() {
        onSave();
        console.log('SAVE');
      },
    });
  };

  onResize = () => {
    if (!this.editor) return;
    this.editor.layout();
  };

  render() {
    const { defaultValue } = this.props;

    return (
      <SizeDetector onResize={this.onResize}>
        {() => (
          <MonacoEditor
            defaultValue={defaultValue}
            language="javascript"
            theme="vs"
            options={{ minimap: { enabled: false }, wordWrap: 'on', fixedOverflowWidgets: true }}
            editorDidMount={this.editorDidMount}
          />
        )}
      </SizeDetector>
    );
  }
}
