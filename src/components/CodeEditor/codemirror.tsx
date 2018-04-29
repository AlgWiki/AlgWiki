import React, { Component } from 'react';
import CM, { Editor } from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import './codemirror.css';

export interface Props {
  defaultValue: string;
  onRun: () => void;
  onSave: () => void;
}

export default class CodeMirror extends React.Component<Props> {
  private cm?: Editor;

  componentWillUnmount() {
    const { onSave } = this.props;
    onSave(); // auto-save before quit
  }

  initCM = (container: HTMLElement | null) => {
    if (!container) return;
    const { defaultValue, onRun, onSave } = this.props;
    this.cm = CM((cm: HTMLElement) => container.appendChild(cm), {
      value: defaultValue,
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
