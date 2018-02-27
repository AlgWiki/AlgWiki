import {
  createStore, compose, applyMiddleware, combineReducers,
  Store, StoreEnhancer, Middleware, Reducer,
} from 'redux';
import thunk from 'redux-thunk';
import * as RFR from 'redux-first-router';
import { connectRoutes, Location } from 'redux-first-router';
import { History } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';

import routes from '../routes/index';

export interface State {
  location: Location;
}

export const configureStore = (history: History, initialState?: State): Store<State> => {

  const {
    reducer: routeReducer,
    middleware: routeMiddleware,
    enhancer: routeEnhancer,
  } = connectRoutes(history, routes);

  const middlewares: StoreEnhancer<State | undefined> = applyMiddleware(thunk, routeMiddleware);

  const enhancers: StoreEnhancer<State | undefined> = compose(routeEnhancer, middlewares);

  const rootReducer: Reducer<State | undefined> = combineReducers({
    location: routeReducer,
  });

  // let storeCreator;
  // if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
  //   const { persistState } = require('redux-devtools');
  //   const DevTools = require('../containers/DevTools/DevTools');
  //   storeCreator = compose(
  //     middleware,
  //     (window.devToolsExtension || DevTools.instrument)(),
  //     persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
  //   )(createStore);
  // } else {
  //   storeCreator = middleware(createStore);
  // }

  const store = createStore(rootReducer, initialState, enhancers) as Store<State>;

  // if (__DEVELOPMENT__ && module.hot) {
  //   module.hot.accept(() => {
  //     store.replaceReducer(rootReducer);
  //   });
  // }

  return store;
};
