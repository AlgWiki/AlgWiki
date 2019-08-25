import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import '@atlaskit/css-reset';
import './full-size.css';
import DocumentEditor from '../../DocumentEditor';
import { mockTask } from 'common/dist/mock-data/challenge';

storiesOf('DocumentEditor', module).add('basic', () => (
  <DocumentEditor
    title={mockTask.name}
    doc={mockTask.description}
    isEditing
    onEdit={action('onEdit')}
    onCancel={action('onCancel')}
    onDraftSave={action('onDraftSave')}
    onSave={(title, doc) => {
      // console.log(JSON.stringify(doc));
      action('onSave')(title, doc);
    }}
  />
));
