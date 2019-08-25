import React from 'react';
import { storiesOf } from '@storybook/react';
import '@atlaskit/css-reset';
import CodeEditor, { EditorType } from '../../CodeEditor';
// @ts-ignore
import solution from './solution';

delete window.MonacoEnvironment;

storiesOf('CodeEditor/Monaco', module)
  .add('empty', () => <CodeEditor editor={EditorType.Monaco} />)
  .add('default value', () => <CodeEditor editor={EditorType.Monaco} defaultValue={solution} />);
