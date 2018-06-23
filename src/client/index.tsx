// import '../utils/polyfills';

// import React from 'react';

// import ApolloClient from 'apollo-boost';
// import { ApolloProvider } from 'react-apollo';

// import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';

// import createHistory from 'history/createBrowserHistory';

// import { configureStore } from '../state';
// import App from '../containers/App';

// const client = new ApolloClient({
//   uri: '/graphql',
// });

// const store = configureStore(createHistory());

// ReactDOM.render(
//   <ApolloProvider client={client}>
//     <Provider store={store}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </Provider>
//   </ApolloProvider>,
//   document.getElementById('container'),
// );

// import * as LinkifyIt from 'linkify-it';
// console.log('LinkifyIt', LinkifyIt);

// import * as a from './a';
// console.log('a', a);

import a from './a';
console.log('a', a);
a();
