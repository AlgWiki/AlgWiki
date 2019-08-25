import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { theme } from '../src/theme';
import { Header } from '../src/Header';
import { Body } from '../src/Body';

const removeServerInjectedStyles = () => {
  const jssStyles = document.querySelector('#jss-server-side');
  if (jssStyles) jssStyles.remove();
};

export default class AlgApp extends App {
  componentDidMount() {
    removeServerInjectedStyles();
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>Alg.Wiki</title>
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <Body>
            <Component {...pageProps} />
          </Body>
        </ThemeProvider>
      </>
    );
  }
}
