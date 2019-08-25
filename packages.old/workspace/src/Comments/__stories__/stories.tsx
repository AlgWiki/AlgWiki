import React from 'react';
import { storiesOf } from '@storybook/react';
import '@atlaskit/css-reset';
import Comments from '../../Comments';
import { MOCK_USERS } from 'common/dist/mock-data/user';

storiesOf('Comments', module).add('empty', () => <Comments user={MOCK_USERS[0]} comments={[]} />);
