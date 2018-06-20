import React, { Component } from 'react';

import { Container } from './styled';
import { Solution } from '../../../common/model';

export interface Props {
  solutions: Solution[];
}
export default class Solutions extends Component<Props> {
  render() {
    return (
      <Container>
        <span>SOLUTIONS</span>
      </Container>
    );
  }
}
