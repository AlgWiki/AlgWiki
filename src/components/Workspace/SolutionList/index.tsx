import React, { Component } from 'react';
import styled from 'styled-components';
import { Solution } from '../../../models';

const EmptySolutionsText = styled.div`
  color: #ccc;
  font-style: italic;
  text-align: center;
  margin: 16px;
  pointer-events: none;
  flex: 1;
`;

export interface SolutionListProps {
  solutions: Solution[];
}
export default class SolutionList extends React.Component<SolutionListProps> {
  render() {
    const { solutions } = this.props;
    if (solutions.length === 0) {
      return <EmptySolutionsText>No solutions yet...</EmptySolutionsText>;
    }
    return (
      <ul>
        {solutions.map((solution: Solution, i: number) => <li key={i}>solution.user.name</li>)}
      </ul>
    );
  }
}
