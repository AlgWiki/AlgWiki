import React from 'react';
import { NextPage } from 'next';

export const Error: NextPage<{ status: number }> = ({ status }) =>
  status === 404 ? <h2>Page not found!</h2> : <h2>Error</h2>;

Error.getInitialProps = async ({ res }) => ({ status: res ? res.statusCode : 500 });
