import { Route } from './route';
import { Api, ApiRoutes, ApiPushRoutes } from './api';

export type RouteClient<R extends Route<unknown, unknown>> = (data: R['_I']) => Promise<R['_O']>;
export type ApiClient<R extends ApiRoutes> = { [K in keyof R]: RouteClient<R[K]> };

export type PushHandler<P extends ApiPushRoutes> = { [K in keyof P]: () => void };

export type ClientCreator = <A extends Api<any, any>>(
  pushHandler: PushHandler<A['pushRoutes']>,
) => ApiClient<A['routes']>;

export const backendBaseUrl = '/api';

export const createApiClient = <A extends Api<any, any>>(
  pushHandler: PushHandler<A['pushRoutes']>,
  listenForPush: (handler: PushHandler<A['pushRoutes']>) => void,
  makeReq: (url: string, data: unknown) => Promise<any>,
) => {
  listenForPush(pushHandler);

  return new Proxy(
    {},
    {
      get(_target, platform: string) {
        return new Proxy(
          {},
          {
            get(_target, route: string) {
              return makeReq.bind(null, `${backendBaseUrl}/${platform}/${route}`);
            },
          },
        );
      },
    },
  ) as ApiClient<A['routes']>;
};
