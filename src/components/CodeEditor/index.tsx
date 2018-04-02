import React, { Component } from 'react';
import CodeMirror, { Editor } from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import './index.css';

export interface CodeEditorProps {
  /** The code to prefill the editor with. */
  code?: string;
  /** Called when requesting a run of the code. */
  onRun?: () => void;
  /** Called when requesting a save of the code. */
  onSave?: () => void;
  /** Time in milliseconds before auto-save after editing. */
  autoSaveDelay?: number;
}
export interface CodeEditorDefaultProps {
  code: string;
  onRun: () => void;
  onSave: () => void;
  autoSaveDelay: number;
}
export type CodeEditorPropsWithDefaults = CodeEditorProps & CodeEditorDefaultProps;
export default class CodeEditor extends React.Component<CodeEditorProps> {
  static defaultProps: CodeEditorDefaultProps = {
    code: '',
    onRun: () => {},
    onSave: () => {},
    autoSaveDelay: 2000,
  };

  private cm?: Editor;

  componentWillUnmount() {
    const { onSave } = this.props as CodeEditorPropsWithDefaults;
    onSave(); // auto-save before quit
  }

  initCM = (container: HTMLElement | null) => {
    if (!container) return;
    const { code, onRun, onSave } = this.props as CodeEditorPropsWithDefaults;
    this.cm = CodeMirror((cm: HTMLElement) => container.appendChild(cm), {
      value: code,
      mode: 'javascript',
      extraKeys: {
        'Ctrl-R': onRun,
        'Ctrl-Enter': onRun,
        'Ctrl-S': onSave,
      },

      indentUnit: 2,
      smartIndent: true,
      tabSize: 2,
      indentWithTabs: true,
      electricChars: true,
      lineWrapping: true,
      lineNumbers: true,
      fixedGutter: true,
      scrollbarStyle: 'native',
      // lineWiseCopyCut: true,
      undoDepth: 1000,
      historyEventDelay: 1250,
    });
  };

  render() {
    return <div ref={this.initCM} style={{ width: '100%', height: '100%' }} />;
  }
}
