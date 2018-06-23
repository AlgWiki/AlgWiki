import React, { Component } from 'react';
import DynamicTable from '@atlaskit/dynamic-table';
import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { Solution } from '../../../common/model';
import { EmptySolutionsText } from './styled';

export interface Props {
  solutions: Solution[];
}
export default class Solutions extends Component<Props> {
  render() {
    const { solutions } = this.props;
    return (
      <DynamicTable
        rowsPerPage={5}
        isFixedSize
        defaultSortKey="chars"
        defaultSortOrder="ASC"
        emptyView={<EmptySolutionsText>No solutions yet...</EmptySolutionsText>}
        head={{
          cells: [
            { key: 'user', content: 'User' },
            { key: 'chars', isSortable: true, content: 'Chars', width: 25 },
          ],
        }}
        rows={solutions.map(({ user, code }) => ({
          cells: [
            {
              content: (
                <AvatarItem
                  avatar={<Avatar src={user.avatarUrl} />}
                  primaryText={user.name}
                  backgroundColor="transparent"
                />
              ),
            },
            { content: code.length },
          ],
        }))}
      />
    );
  }
}
