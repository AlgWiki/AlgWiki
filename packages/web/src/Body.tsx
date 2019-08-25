import React, { FC } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

export const Body: FC<{}> = ({ children }) => (
  <Container>
    <Box mt={6}>{children}</Box>
  </Container>
);
