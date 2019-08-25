import React from 'react';
import Tabs from '@atlaskit/tabs';
import { Mutation } from 'react-apollo';

import Description from '../Description';
import TestCases from '../TestCases';
import Solutions from '../Solutions';
import Comments from '../Comments';
import CodeEditor from '../../../common/view/CodeEditor';
import { Container, TabsContainer, EditorContainer } from './styled';
import { Task, Solution } from '../../../common/model';
import { PUT_DESCRIPTION } from '../../graphql';

export interface Props {
  task: Task;
  solution: string;
  solutions: Solution[];
}
export default ({ solution, solutions, task }: Props) => {
  const { _id, name, description, testCases, methods } = task;
  const tabs = [
    {
      label: 'Description',
      content: (
        <Mutation mutation={PUT_DESCRIPTION}>
          {putDescription => (
            <Description
              title={name}
              doc={description}
              onSave={(newName, newDescription) => {
                putDescription({
                  variables: { id: _id, name: newName, description: newDescription },
                });
              }}
            />
          )}
        </Mutation>
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
};
