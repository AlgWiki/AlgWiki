import React from 'react';
import { NextPage } from 'next';
import { styled } from '@material-ui/core';
import { TextAlignProperty } from 'csstype';

const WorkspaceContainer = styled('div')({
  display: 'flex',
  height: 400,
  minWidth: 800,
  width: '90%',
  maxWidth: 1400,
  border: '1px solid #ccc',
  boxShadow: '#ccc 0 0 8px',
  margin: '8px auto',
  clear: 'both',
  background: '#fff',
});

// const CenteredSpinner = styled.div`
//   margin: auto;
// `;

const Section = styled('section')(
  ({ align = 'left', color = 'initial' }: { align?: TextAlignProperty; color?: string }) => ({
    textAlign: align,
    clear: 'both',
    backgroundColor: color,
    padding: 8,
  }),
);

// const SideImage = styled.img<{ float?: string }>`
//   width: 200px;
//   max-height: 180px;
//   margin: 16px;
//   float: ${({ float = 'left' }) => float};
// `;

export const Home: NextPage<{}> = () => (
  <article>
    <Section>
      <h2>Search the database for algorithms to solve specific problems</h2>
      <p>Need an efficient algorithm to X?</p>
      <p>
        With many different computer science problems in the database along with a variety of
        solutions, you can easily find the best way to deal with your situation.
      </p>
    </Section>

    <Section align="right" color="#eeeeee">
      <h2>Compete to find the most efficient solution</h2>
      <p>
        Win by finding the fastest, shortest or most elegant piece of code which solves a task. New
        competitions start every day.
      </p>
      <p>Give the current problem a try right now:</p>

      <WorkspaceContainer>
        Workspace
        {/* <Workspace task={mockTask} solution={mockSolution} solutions={[]} /> */}
      </WorkspaceContainer>
    </Section>

    <Section>
      <h2>Improve your coding skills</h2>
      <p>
        Work through a curated set of problems and read explanations for a variety of topics and
        difficulty levels to build your knowledge.
      </p>
    </Section>
  </article>
);
