import React, { Component } from 'react';
import styled from 'styled-components';
import Spinner from '@atlaskit/spinner';
import { LoadingComponentProps } from 'react-loadable';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  flex: 1;
`;

export default class LoadingIndicator extends Component<LoadingComponentProps> {
  render() {
    return (
      <Container>
        <Spinner size="large" />
      </Container>
    );
  }
}
