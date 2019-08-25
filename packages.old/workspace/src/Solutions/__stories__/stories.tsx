import React from 'react';
import { storiesOf } from '@storybook/react';
import '@atlaskit/css-reset';
import Solutions from '../../Solutions';

storiesOf('Solutions', module).add('empty', () => <Solutions solutions={[]} />);
