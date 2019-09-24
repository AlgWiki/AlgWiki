import { Route } from './route';

export const backendBaseUrl = '/api';

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

/** Platform key string (used in API route URLs) with the API type baked in. */
export type PlatformKey<A extends Api> = string & Pick<A, never>;
