import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import Spinner from '@atlaskit/spinner';

import SVGBuildingFunctionality from './assets/building-functionality.svg';
import SVGGrowing from './assets/growing.svg';
import SVGLaboratory from './assets/laboratory.svg';
import Workspace from '../Workspace/async';

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

const getHomePageChallenge = gql`
  query GetHomePageChallenge {
    tasks(start: 0, limit: 1) {
      _id
      name
      description
      methods {
        id
        name
        description
        parameters
      }
      testCases {
        id
        name
        isHidden
        isActive
        calls {
          id
          methodId
          input
          expectedOutput
        }
      }
    }
  }
`;

export default class Home extends Component {
  componentDidMount() {
    Workspace.preload();
  }

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
            solutions, you can easily find the best way to deal with your situation.
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
            <Query query={getHomePageChallenge}>
              {({ loading, data }) => {
                if (loading) return <Spinner size="large" />;
                if (!data) return <span>Error loading challenge...</span>;
                return <Workspace task={data.tasks[0]} />;
              }}
            </Query>
          </WorkspaceContainer>
        </Section>

        <Section>
          <SideImage src={SVGGrowing} />
          <h2>Improve your coding skills</h2>
          <p>
            Work through a curated set of problems and read explanations for a variety of topics and
            difficulty levels to build your knowledge.
          </p>
        </Section>
      </article>
    );
  }
}
