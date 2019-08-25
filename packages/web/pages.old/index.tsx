import React from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import Spinner from '@atlaskit/spinner';
import dynamic from 'next/dynamic';
import { mockTask, mockSolution } from 'common/dist/mock-data/challenge';

const WorkspaceContainer = styled.div`
  display: flex;
  height: 400px;
  min-width: 800px;
  width: 90%;
  max-width: 1400px;
  border: 1px solid #ccc;
  box-shadow: #ccc 0 0 8px;
  margin: 8px auto;
  clear: both;
  background: #fff;
`;

const CenteredSpinner = styled.div`
  margin: auto;
`;

const Section = styled.section<{ align?: string; color?: string }>`
  text-align: ${({ align = 'left' }) => align};
  clear: both;
  background-color: ${({ color = 'initial' }) => color};
  padding: 8px;
`;

const SideImage = styled.img<{ float?: string }>`
  width: 200px;
  max-height: 180px;
  margin: 16px;
  float: ${({ float = 'left' }) => float};
`;

const Workspace = dynamic({
  loader: async () => (await import('workspace')).default,
  loading: () => (
    <CenteredSpinner>
      <Spinner size="xlarge" />
    </CenteredSpinner>
  ),
  ssr: false,
});

export default function Home() {
  return (
    <article>
      <Section>
        <SideImage src="/static/building-functionality.svg" />
        <h2>Search the database for algorithms to solve specific problems</h2>
        <p>Need an efficient algorithm to X?</p>
        <p>
          With many different computer science problems in the database along with a variety of
          solutions, you can easily find the best way to deal with your situation.
        </p>
      </Section>

      <Section align="right" color={colors.N20}>
        <SideImage src="/static/laboratory.svg" float="right" />
        <h2>Compete to find the most efficient solution</h2>
        <p>
          Win by finding the fastest, shortest or most elegant piece of code which solves a task.
          New competitions start every day.
        </p>
        <p>Give the current problem a try right now:</p>

        <WorkspaceContainer>
          <Workspace task={mockTask} solution={mockSolution} solutions={[]} />
        </WorkspaceContainer>
      </Section>

      <Section>
        <SideImage src="/static/growing.svg" />
        <h2>Improve your coding skills</h2>
        <p>
          Work through a curated set of problems and read explanations for a variety of topics and
          difficulty levels to build your knowledge.
        </p>
      </Section>
    </article>
  );
}
