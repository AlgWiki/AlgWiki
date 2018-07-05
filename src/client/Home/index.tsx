import React, { Component } from 'react';
// import Link from 'redux-first-router-link';
// import { Query } from 'react-apollo';
// import gql from 'graphql-tag';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
// import Spinner from '@atlaskit/spinner';

import SVGBuildingFunctionality from './assets/building-functionality.svg';
import SVGGrowing from './assets/growing.svg';
import SVGLaboratory from './assets/laboratory.svg';
import Workspace from '../Workspace/async';
import { mockTask } from '../common/mock-data/challenge';

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

const Section: any = styled.section`
  text-align: ${({ align = 'left' }: any) => align};
  clear: both;
  background-color: ${({ color = 'initial' }: any) => color};
  padding: 8px;
`;

const SideImage: any = styled.img`
  width: 200px;
  max-height: 180px;
  margin: 16px;
  float: ${({ float = 'left' }: any) => float};
`;

// TODO: Update styled component definition types after upgrading to TS >2.9.1
// const SideImage = styled.img<{ float?: string }>`
//   float: ${({ float = 'left' }) => float};
// `;

// const query = gql`
//   {
//     tasks {
//       name
//       description
//       methods {
//         id
//         name
//         description
//         parameters
//       }
//       testCases {
//         id
//         name
//         isHidden
//         isActive
//         calls {
//           id
//           methodId
//           input
//           expectedOutput
//         }
//       }
//     }
//   }
// `;

export default class Home extends Component {
  render() {
    return (
      <article>
        <Section>
          <SideImage src={SVGBuildingFunctionality} />
          <h2>Search the database for algorithms to solve specific problems</h2>
          <p>Need an efficient algorithm to X?</p>
          <p>Or maybe you're stumped trying to implement Y?</p>
          <p>
            With many different computer science problems in the database along with a variety of
            solutions, you can find the best way to deal with your situation.
          </p>
        </Section>

        <Section align="right" color={colors.N20}>
          <SideImage src={SVGLaboratory} float="right" />
          <h2>Compete to find the most efficient solution</h2>
          <p>Think you know a bit about programming already?</p>
          <p>
            Win by finding the fastest, shortest (code golf) or most elegant piece of code which
            solves a task. New competitions start every day.
          </p>
          <p>Give the current problem a try right now:</p>

          <WorkspaceContainer>
            {/* <Query query={query}>
              {({ loading, data }) => {
                console.log({ loading, data });
                if (loading) return <Spinner size="large" />;
                if (!data) return <span>Error loading challenge...</span>;
                return <Workspace task={data.tasks[0]} />;
              }}
            </Query> */}
            <Workspace task={mockTask} />
          </WorkspaceContainer>
        </Section>

        <Section>
          <SideImage src={SVGGrowing} />
          <h2>Improve your coding skills</h2>
          <p>
            Work through a curated set of problems and read explanations of a variety of topics and
            difficulty levels to build your knowledge.
          </p>
        </Section>

        {/* <Link to="/how">How does it work?</Link> */}
      </article>
    );
  }
}
