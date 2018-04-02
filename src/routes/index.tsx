import React, { Component, ComponentType, Props } from 'react';
import Loadable from 'react-loadable';
import { Promise } from 'es6-promise';

// Action types
export const HOME = 'routes/HOME';
export const HOW = 'routes/HOW';

// Route components
export interface RouteLoaders {
  [actionType: string]: () => any; // Promise<ComponentType<Props<any>>>; // TODO: What type are the import results?
}
export const routeLoaders: RouteLoaders = {
  [HOME]: () => import(/* webpackChunkName: "home" */ '../containers/Home/index'),
  [HOW]: () => import(/* webpackChunkName: "how" */ '../containers/How/index'),
};
export interface RouteComponents {
  [actionType: string]: ComponentType;
}
export const routeComponents: RouteComponents = {};
for (const key in routeLoaders) {
  routeComponents[key] = Loadable({
    loader: routeLoaders[key],
    loading: () => <div>Loading...</div>,
  });
}

// Route map
export interface Routes {
  [actionType: string]: string;
}
export const routes: Routes = {
  [HOME]: '/',
  [HOW]: '/how',
};
export default routes;
