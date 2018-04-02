import '../utils/polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { configureStore } from '../state';
import App from '../containers/App';

const store = configureStore(createHistory());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('container'),
);
