import React from 'react';
import { storiesOf } from '@storybook/react';
import '@atlaskit/css-reset';
import Workspace from '../../Workspace';
import { mockTask, mockSolution } from 'common/dist/mock-data/challenge';

storiesOf('Workspace', module).add('empty', () => (
  <Workspace task={mockTask} solution={mockSolution} solutions={[]} />
));
