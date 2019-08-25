import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';
import { isBrowser } from './is-browser';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!isBrowser) {
  (global as any).fetch = fetch;
}

export const create = (initialState?: NormalizedCacheObject) => {
  const graphQlUrl = isBrowser ? `${window.location.origin}/graphql` : '';
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: new HttpLink({
      uri: graphQlUrl,
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache().restore(initialState || {}),
  });
};

export const initApollo = (initialState?: NormalizedCacheObject) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
};
