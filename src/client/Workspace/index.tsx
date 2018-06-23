import React, { Component } from 'react';
import Tabs from '@atlaskit/tabs';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';

import { mockSolutions } from '../common/mock-data/challenge';
import { Task } from '../common/model';
import CodeEditor from '../common/view/CodeEditor';
import Description from './view/Description';
import TestCases from './view/TestCases';
import Solutions from './view/Solutions';
import Comments from './view/Comments';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  text-align: left;
  background: #fff;
`;

const TabsContainer = styled.div`
  display: flex;
  width: 50%;
  flex-grow: 1;
`;

const EditorContainer = styled.div`
  flex-grow: 1;
  width: 50%;
  border-left: 1px solid #ccc;
`;

const TabContent = styled.div`
  display: flex;
  flex-grow: 1;
  min-height: 0%;
  padding: ${gridSize}px;
  overflow: auto;
`;

export interface Props {
  task: Task;
  // challenge?: Challenge;
}
export default class Workspace extends Component<Props> {
  render() {
    const { task } = this.props;
    const { name, description, testCases, methods } = task;
    // const { solutions, comments } = challenge || { solutions: [], comments: [] };
    const solution = 'const asdf = n => n+1;';

    const tabs = [
      {
        label: 'Description',
        content: <Description title={name} doc={description} />,
      },
      {
        label: 'Test Cases',
        content: <TestCases cases={testCases} methods={methods} />,
      },
      {
        label: 'Solutions',
        content: <Solutions solutions={mockSolutions} />,
      },
      {
        label: 'Comments',
        content: <Comments comments={[]} />,
      },
    ];

    return (
      <Container>
        <TabsContainer>
          <Tabs tabs={tabs} />
        </TabsContainer>
        <EditorContainer>
          <CodeEditor defaultValue={solution} />
        </EditorContainer>
      </Container>
    );
  }
}
