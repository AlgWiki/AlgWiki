import React, { Component } from 'react';
import CodeMirror from './CodeMirror';
import Monaco from './Monaco';

export enum EditorType {
  CodeMirror,
  Monaco,
}

export interface Props {
  /** The code to prefill the editor with. */
  defaultValue: string;
  /** Called when requesting a run of the code. */
  onRun: () => void;
  /** Called when requesting a save of the code. */
  onSave: () => void;
  /** Time in milliseconds before auto-save after editing. */
  autoSaveDelay: number;
  /** The editor to use. */
  editor: EditorType;
}

export default class CodeEditor extends Component<Props> {
  static defaultProps = {
    defaultValue: '',
    onRun: () => {},
    onSave: () => {},
    autoSaveDelay: 2000,
    editor: EditorType.Monaco,
  };

  render() {
    const { defaultValue, onRun, onSave, editor } = this.props;
    const EditorComponent = editor === EditorType.CodeMirror ? CodeMirror : Monaco;
    return <EditorComponent defaultValue={defaultValue} onRun={onRun} onSave={onSave} />;
  }
}
