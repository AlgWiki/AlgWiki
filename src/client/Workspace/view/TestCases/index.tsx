import React, { Component } from 'react';

import { Container } from './styled';
import { TestCase, Method } from '../../../common/model';

export interface Props {
  cases: TestCase[];
  methods: Method[];
}
export default class TestCases extends Component<Props> {
  render() {
    return (
      <Container>
        <span>TEST CASES</span>
      </Container>
    );
  }
}
