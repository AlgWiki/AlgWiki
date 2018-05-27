import React, { Component, ComponentClass } from 'react';
import CodeMirror from './codemirror';
import Monaco from './monaco';

export enum EditorType {
  CodeMirror,
  Monaco,
}

export interface Props {
  /** The code to prefill the editor with. */
  defaultValue?: string;
  /** Called when requesting a run of the code. */
  onRun?: () => void;
  /** Called when requesting a save of the code. */
  onSave?: () => void;
  /** Time in milliseconds before auto-save after editing. */
  autoSaveDelay?: number;
  /** The editor to use. */
  editor?: EditorType;
}

class CodeEditor extends React.Component<InternalProps<Props, typeof CodeEditor.defaultProps>> {
  static defaultProps: DefaultProps<Props> = {
    defaultValue: '',
    onRun: () => {},
    onSave: () => {},
    autoSaveDelay: 2000,
    editor: EditorType.Monaco,
  };

  render() {
    const { defaultValue, onRun, onSave, autoSaveDelay, editor } = this.props;
    const EditorComponent = editor === EditorType.CodeMirror ? CodeMirror : Monaco;
    return <EditorComponent defaultValue={defaultValue} onRun={onRun} onSave={onSave} />;
  }
}

export default CodeEditor as ComponentClass<Props>;
