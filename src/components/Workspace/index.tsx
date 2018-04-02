import React, { Component } from 'react';
import Tabs from '@atlaskit/tabs';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';

import CodeEditor from '../CodeEditor';
import Description from './Description';
import SolutionList from './SolutionList';
import CommentList from './CommentList';
import { Solution, Comment } from '../../models';

const TabContent = styled.div`
  display: flex;
  flex-grow: 1;
  min-height: 0%; /* See min-height note */
  padding-left: ${gridSize}px;
  padding-right: ${gridSize}px;
  overflow: auto;
`;

export interface WorkspaceProps {
  solutions?: Solution[];
  hasComments?: boolean;
}
export default class Workspace extends React.Component<WorkspaceProps> {
  render() {
    const { solutions, hasComments = true } = this.props;
    const tabs = [
      {
        label: 'Description',
        content: <Description content="Description here..." />,
      },
    ];
    if (solutions) {
      tabs.push({
        label: 'Solutions',
        content: <SolutionList solutions={solutions} />,
      });
    }
    if (hasComments) {
      tabs.push({
        label: 'Comments',
        content: <CommentList />,
      });
    }
    return (
      <div style={{ display: 'flex', height: '100%', width: '100%', textAlign: 'left' }}>
        <div style={{ flexGrow: 1, minWidth: 400, display: 'flex' }}>
          <Tabs tabs={tabs} />
        </div>
        <div style={{ flexGrow: 1, minWidth: 400 }}>
          <CodeEditor />
        </div>
      </div>
    );
  }
}
