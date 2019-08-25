import { AppProps, DefaultAppIProps } from 'next/app';
import Header from '../components.old/Header';
import '@atlaskit/css-reset';
import { withApollo, RequiredAppProps } from '../lib.old/with-apollo';
import { ApolloProvider } from 'react-apollo';

export const App = ({
  Component,
  pageProps,
  apolloClient,
}: RequiredAppProps & AppProps & DefaultAppIProps) => (
  <ApolloProvider client={apolloClient}>
    <main>
      <Header />
      <Component {...pageProps} />
    </main>
  </ApolloProvider>
);

export default withApollo(App);
