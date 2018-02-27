import React, { Component } from 'react';
import { Solution } from '../../../models';

export interface SolutionListProps {
  solutions: Solution[];
}
export default class SolutionList extends Component {
  render() {
    const { solutions } = this.props;
    return <ul>{solutions.map((solution: Solution, i: number) => <li key={i}>solution.user.name</li>)}</ul>;
  }
}
