import * as React from 'react';
import Link from 'redux-first-router-link';
import styled, { StyledFunction, StyledComponentClass } from 'styled-components';
import { colors } from '@atlaskit/theme';

import SVGBuildingFunctionality from './building-functionality.svg';
import SVGGrowing from './growing.svg';
import SVGLaboratory from './laboratory.svg';

import Workspace from '../../components/Workspace';

const WorkspaceContainer = styled.div`
  height: 400px;
  min-width: 800px;
  width: 90%;
  max-width: 1400px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: #ccc 0 0 8px;
  margin: 8px auto;
  clear: both;
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

export default class Home extends React.Component {
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
            solves a task. New competitions start every day with a week to perfect and hone your
            submission.
          </p>

          <WorkspaceContainer>
            <Workspace solutions={[]} hasComments={true} />
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

        <Link to="/how">How does it work?</Link>
      </article>
    );
  }
}
