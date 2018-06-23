import React, { Component, ComponentClass } from 'react';
import Tabs from '@atlaskit/tabs';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';

import CodeEditor from '../CodeEditor';
import Description from './Description';
import SolutionList from './SolutionList';
import CommentList from './CommentList';
import { Solution, Comment, Method, TestCase, ValueType, Task, Challenge } from '../../models';
import { testSolution } from './Description/test-challenge';
import TestCases from '../TestCases';
import { MOCK_USERS } from '../../mocks/conversation';

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
  challenge?: Challenge;
}
class Workspace extends React.Component<Props> {
  render() {
    const { task, challenge } = this.props;
    const { name, description, testCases, methods } = task;
    const { solutions, comments } = challenge || { solutions: [], comments: [] };

    const tabs = [
      {
        label: 'Description',
        content: <Description title={name} doc={description} />,
      },
    ];

    tabs.push({
      label: 'Test Cases',
      content: <TestCases cases={testCases} methods={methods} />,
    });

    if (solutions) {
      tabs.push({
        label: 'Solutions',
        content: <SolutionList solutions={solutions} />,
      });
    }

    tabs.push({
      label: 'Comments',
      content: <CommentList comments={comments} />,
    });

    return (
      <Container>
        <TabsContainer>
          <Tabs tabs={tabs} />
        </TabsContainer>
        <EditorContainer>
          <CodeEditor defaultValue={testSolution} />
        </EditorContainer>
      </Container>
    );
  }
}

export default Workspace as ComponentClass<Props>;
