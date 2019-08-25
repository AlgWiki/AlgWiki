import React from 'react';
import Tabs from '@atlaskit/tabs';
// import { Mutation } from 'react-apollo';

import Description from '../Description';
import TestCases from '../TestCases';
import Solutions from '../Solutions';
import Comments from '../Comments';
import CodeEditor from '../CodeEditor';
import { Container, TabsContainer, EditorContainer } from './styled';
import { Task, Solution, User } from 'common/dist/model';

export interface Props {
  task: Task;
  solution: string;
  solutions: Solution[];
  user?: User;
}
export default function Workspace({ solution, solutions, task, user }: Props) {
  const { name, description, testCases, methods } = task;
  const tabs = [
    {
      label: 'Description',
      content: (
        <Description
          title={name}
          doc={description}
          // onSave={(newName, newDescription) => {
          //   putDescription({
          //     variables: { id: _id, name: newName, description: newDescription },
          //   });
          // }}
        />
      ),
    },
    {
      label: 'Test Cases',
      content: <TestCases cases={testCases} methods={methods} />,
    },
    {
      label: 'Solutions',
      content: <Solutions solutions={solutions} />,
    },
    {
      label: 'Comments',
      content: <Comments user={user} comments={[]} />,
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
