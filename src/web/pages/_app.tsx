import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { theme } from '../theme';
import { Header } from '../components/header';
import { Body } from '../components/body';
import { PageLoadIndicator } from '../components/page-load-indicator';

const removeServerInjectedStyles = () => {
  const jssStyles = document.querySelector('#jss-server-side');
  if (jssStyles) jssStyles.remove();
};

export class AlgApp extends App {
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
          <PageLoadIndicator />
          <Header />
          <Body>
            <Component {...pageProps} />
          </Body>
        </ThemeProvider>
      </>
    );
  }
}
