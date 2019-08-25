import { Route } from './route';

export interface ApiRoutes {
  [route: string]: Route<unknown, unknown>;
}

export interface ApiPushRoutes {
  [route: string]: unknown;
}

export class Api<R extends ApiRoutes = ApiRoutes, P extends ApiPushRoutes = ApiPushRoutes> {
  routes: R;
  pushRoutes: P;

  constructor({ routes, pushRoutes }: { routes: R; pushRoutes: P }) {
    this.routes = routes;
    this.pushRoutes = pushRoutes;
  }
}
