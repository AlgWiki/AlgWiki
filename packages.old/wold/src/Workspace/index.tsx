import React, { Component } from 'react';
import { Query } from 'react-apollo';

import { mockSolutions } from '../common/mock-data/challenge';
import Container from './view/Container';
import { Task } from '../common/model';
import { GET_TASK } from './graphql';

export interface Props {
  taskId?: string;
  task?: Task;
}
export default class Workspace extends Component<Props> {
  render() {
    const { task, taskId } = this.props;
    // const { solutions, comments } = challenge || { solutions: [], comments: [] };
    const solution = `const nthPrime = n => {
    let num = 1;
    let nth = 0;
    while (nth < n) {
        num++;
        if (isPrime(num)) nth++;
    }
    return num;
};

const isPrime = n => {
    if (n < 2) return false;
    for (let i = 2; i < Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
};`;

    if (task) {
      return <Container task={task} solutions={mockSolutions} solution={solution} />;
    }

    if (taskId) {
      return (
        <Query query={GET_TASK} variables={{ id: taskId }}>
          {({ loading, data }) => {
            if (loading) return null;
            if (!data) return <span>Error loading challenge...</span>;

            return <Container task={data.taskById} solutions={mockSolutions} solution={solution} />;
          }}
        </Query>
      );
    }

    return null;
  }
}
