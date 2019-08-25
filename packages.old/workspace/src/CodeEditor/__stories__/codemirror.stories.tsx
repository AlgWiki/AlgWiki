import React from 'react';
import { storiesOf } from '@storybook/react';
import '@atlaskit/css-reset';
import CodeEditor, { EditorType } from '../../CodeEditor';
import solution from './solution';

storiesOf('CodeEditor/CodeMirror', module)
  .add('empty', () => <CodeEditor editor={EditorType.CodeMirror} />)
  .add('default value', () => (
    <CodeEditor editor={EditorType.CodeMirror} defaultValue={solution} />
  ));
