import React, { Component } from 'react';
import styled from 'styled-components';
import DynamicTable from '@atlaskit/dynamic-table';
import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { Solution } from '../../../models';

const EmptySolutionsText = styled.div`
  color: #ccc;
  font-style: italic;
  text-align: center;
  margin: 16px;
  pointer-events: none;
  flex: 1;
`;

export interface SolutionListProps {
  solutions: Solution[];
}
export default class SolutionList extends React.Component<SolutionListProps> {
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
