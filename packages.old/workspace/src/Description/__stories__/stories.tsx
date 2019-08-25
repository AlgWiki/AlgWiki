import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import '@atlaskit/css-reset';
import Description from '../../Description';
import knapsackDoc from './knapsack.json';

storiesOf('Description', module).add('editable', () => (
  <Description title="Knapsack" doc={knapsackDoc} onSave={action('onSave')} />
));
