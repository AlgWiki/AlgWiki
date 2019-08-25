import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import SizeDetector from '@atlaskit/size-detector';

export interface Props {
  defaultValue: string;
  onRun: () => void;
  onSave: () => void;
}
export default class Monaco extends Component<Props> {
  editor: any = null;
  monaco: any = null;

  editorDidMount = (editor: any, monaco: any) => {
    const { onRun, onSave } = this.props;
    this.editor = editor;
    this.monaco = monaco;

    // Prevent page scrolling when reaching the end of the editor on scroll
    const editorContainer: HTMLElement = editor.domElement;
    editorContainer.addEventListener('wheel', e => {
      e.preventDefault();
    });

    // Add 'Run Code' action
    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_R,
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_ENTER,
      ],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1,
      run: (editor: any) => {
        onRun();
        console.log('RUN');
        return null;
      },
    });

    // Add 'Save Code' action
    editor.addAction({
      id: 'save-code',
      label: 'Save Code',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.1,
      run: (editor: any) => {
        onSave();
        console.log('SUBMIT');
        return null;
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
            options={{
              minimap: { enabled: false },
              wordWrap: 'on',
              fixedOverflowWidgets: true,
            }}
            editorDidMount={this.editorDidMount}
          />
        )}
      </SizeDetector>
    );
  }
}
