import React, { Component, ComponentClass } from 'react';
import Tabs from '@atlaskit/tabs';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';

import CodeEditor from '../CodeEditor';
import Description from './Description';
import SolutionList from './SolutionList';
import CommentList from './CommentList';
import { Solution, Comment, Method, TestCase, ValueType } from '../../models';
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

const sampleTestCases: TestCase[] = [
  {
    id: 't1',
    name: null,
    isHidden: false,
    isActive: true,
    calls: [
      {
        id: 'c1',
        methodId: 'm1',
        input: [{ type: ValueType.Integer, value: '123' }],
        expectedOutput: { type: ValueType.Integer, value: '54321' },
      },
    ],
  },
  {
    id: 't2',
    name: null,
    isHidden: false,
    isActive: true,
    calls: [
      {
        id: 'c2',
        methodId: 'm1',
        input: [{ type: ValueType.Integer, value: '7' }],
        expectedOutput: { type: ValueType.Integer, value: '11' },
      },
    ],
  },
];
const sampleMethods: Method[] = [
  {
    id: 'm1',
    name: 'nthPrime',
    parameters: [{ name: 'n', type: ValueType.Integer, constraints: '0 < n < inf' }],
  },
];
const sampleUsers = [...MOCK_USERS];
const sampleSolutions: Solution[] = [];
for (let i = 0; i < MOCK_USERS.length; i++) {
  sampleSolutions.push({
    user: sampleUsers.splice(Math.random() * sampleUsers.length, 1)[0],
    code: 'const sample = n => n+3; /' + '/'.repeat(Math.random() * 500),
  });
}

export interface Props {
  solutions?: Solution[];
  hasComments?: boolean;
  hasTestCases?: boolean;
}
class Workspace extends React.Component<InternalProps<Props, typeof Workspace.defaultProps>> {
  static defaultProps: DefaultProps<Props> = {
    solutions: [],
    hasComments: true,
    hasTestCases: true,
  };

  render() {
    const { solutions, hasComments, hasTestCases } = this.props;

    const tabs = [
      {
        label: 'Description',
        content: <Description content="Description here..." />,
      },
    ];

    if (hasTestCases) {
      tabs.push({
        label: 'Test Cases',
        content: <TestCases cases={sampleTestCases} methods={sampleMethods} />,
      });
    }

    if (solutions) {
      tabs.push({
        label: 'Solutions',
        content: <SolutionList solutions={sampleSolutions} />,
      });
    }

    if (hasComments) {
      tabs.push({
        label: 'Comments',
        content: <CommentList />,
      });
    }

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
