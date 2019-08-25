import React from 'react';
import { storiesOf } from '@storybook/react';
import '@atlaskit/css-reset';
import TestCases from '../../TestCases';

storiesOf('TestCases', module).add('empty', () => <TestCases cases={[]} methods={[]} />);
