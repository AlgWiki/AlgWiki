import React, { Component } from 'react';
import Tabs from '@atlaskit/tabs';

import CodeEditor from '../CodeEditor';
import Description from './Description';
import SolutionList from './SolutionList';
import CommentList from './CommentList';
import { Solution, Comment } from '../../models';

export interface WorkspaceProps {
  solutions?: Solution[];
  comments?: Comment[];
}
export default class Workspace extends Component<WorkspaceProps> {
  render() {
    const { solutions, comments } = this.props;
    const tabs = [{
      label: 'Description',
      content: <Description content="Description here..." />,
    }];
    if (solutions) {
      tabs.push({
        label: 'Solutions',
        content: <SolutionList solutions={solutions} />,
      });
    }
    if (comments) {
      tabs.push({
        label: 'Comments',
        content: <CommentList comments={comments} />,
      });
    }
    return (
      <div style={{ display: 'flex', height: '100%', width: '100%', textAlign: 'left' }}>
        <div style={{ flexGrow: 1, minWidth: 400 }}>
          <Tabs tabs={tabs} />
        </div>
        <div style={{ flexGrow: 1, minWidth: 400 }}>
          <CodeEditor />
        </div>
      </div>
    );
  }
}
