import React from 'react';
import { storiesOf } from '@storybook/react';
import '@atlaskit/css-reset';
import PrettyLog from '../../PrettyLog';
import { ValueType } from 'common/dist/model';

storiesOf('PrettyLog', module).add('integer', () => (
  <PrettyLog value={{ type: ValueType.Integer, value: '12345' }} />
));
