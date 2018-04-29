import React, { Component, ComponentClass } from 'react';
import CodeMirror from './codemirror';

export interface Props {
  /** The code to prefill the editor with. */
  defaultValue?: string;
  /** Called when requesting a run of the code. */
  onRun?: () => void;
  /** Called when requesting a save of the code. */
  onSave?: () => void;
  /** Time in milliseconds before auto-save after editing. */
  autoSaveDelay?: number;
}

class CodeEditor extends React.Component<InternalProps<Props, typeof CodeEditor.defaultProps>> {
  static defaultProps: DefaultProps<Props> = {
    defaultValue: '',
    onRun: () => {},
    onSave: () => {},
    autoSaveDelay: 2000,
  };

  render() {
    const { defaultValue, onRun, onSave, autoSaveDelay } = this.props;
    return <CodeMirror defaultValue={defaultValue} onRun={onRun} onSave={onSave} />;
  }
}

export default CodeEditor as ComponentClass<Props>;
