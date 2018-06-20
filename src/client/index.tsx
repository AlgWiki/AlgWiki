// import '../utils/polyfills';

// import * as hi from './test';
// console.log({ hi: hi() });

import React from 'react';
import ReactDOM from 'react-dom';

// import ApolloClient from 'apollo-boost';
// import { ApolloProvider } from 'react-apollo';

// import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// import createHistory from 'history/createBrowserHistory';

// import { configureStore } from '../state';
import App from './App';

// const client = new ApolloClient({
//   uri: '/graphql',
// });

// const store = configureStore(createHistory());

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  // <ApolloProvider client={client}>
  //   <Provider store={store}>
  //     <BrowserRouter>
  //       <App />
  //     </BrowserRouter>
  //   </Provider>
  // </ApolloProvider>,
  document.getElementById('container'),
);
