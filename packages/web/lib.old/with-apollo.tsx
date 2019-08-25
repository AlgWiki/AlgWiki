import React, { Component } from 'react';
import { initApollo } from './init-apollo';
import Head from 'next/head';
import { getDataFromTree } from 'react-apollo';
import { NextAppContext } from 'next/app';
import { NextComponentType } from 'next';
import { isBrowser } from './is-browser';
import { NormalizedCacheObject, ApolloClient } from 'apollo-boost';

export interface RequiredAppProps {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

export interface ExtraProps {
  apolloState: NormalizedCacheObject;
}

export const withApollo = function<P extends RequiredAppProps>(
  App: NextComponentType<P, P, NextAppContext>,
) {
  return class WithApollo extends Component<P & ExtraProps> {
    static async getInitialProps(ctx: NextAppContext) {
      const { Component, router } = ctx;

      const appProps = App.getInitialProps ? await App.getInitialProps(ctx) : ({} as P);

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apollo = initApollo();
      if (!isBrowser) {
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <App {...appProps} Component={Component} router={router} apolloClient={apollo} />,
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error('Error while running `getDataFromTree`', error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
      };
    }

    apolloClient: ReturnType<typeof initApollo>;

    constructor(props: P & ExtraProps) {
      super(props);
      this.apolloClient = initApollo(props.apolloState);
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
};
