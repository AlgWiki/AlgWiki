import type { MaybePromise } from "@oxy2/utils";

import { EndpointContext, O2EndpointInput, O2EndpointOutput } from ".";
import { O2Endpoint, O2EndpointAny } from "./O2Endpoint";
import { O2ClientError } from "./errors";

export interface InitialContext {
  endpoint: O2EndpointAny;
  path: string[];
  apis: O2ApiAny[];
}

export type MiddlewareNext = () => Promise<void>;

/**
 * O2 middleware behaves similarly to Koa middleware, however it is a bit more
 * type-safe than regular Koa. In O2 middleware specify which properties are
 * _required_ on the context (to be provided by middleware prior in the chain)
 * and which properties are _added_ to the context (for use in future middleware).
 *
 * The purpose of this typing system is to:
 * - Allow creation of middleware which are completely independent of the
 *   underlying connection. For example, a middleware which counts the number of
 *   requests received should not need modifications if the backend were moved
 *   from HTTP to web sockets, service workers, gRPC, inter-process communication
 *   or any other protocol or transport since it does not consume any of the
 *   HTTP context properties.
 * - Aid mocking for tests so it is clear which properties need mocking.
 *
 * Since there are no "standard" context properties they should be imported from
 * O2 if they exist (eg. for HTTP context) or a custom context shape could be
 * created and imported by other middleware which consume this custom context.
 */
export interface O2Middleware<RequiredContext, AddedContext = {}> {
  (
    ctx: RequiredContext & Partial<AddedContext>,
    next: MiddlewareNext
  ): MaybePromise<void>;
}
type O2MiddlewareUnknown = O2Middleware<unknown, unknown>;

/** A collection of `O2Endpoint`s and child `O2Api`s.
 *
 * In addition to grouping conceptually similar routes, `O2Api`s can be used to
 * apply middleware to many routes at once. For example, you could put all your
 * routes which require authentication behind an `O2Api` which has a middleware
 * to deny any unauthenticated requests. That way you don't need to worry about
 * forgetting to add the auth check to a new endpoint. */
export class O2Api<
  Routes extends Record<string, O2EndpointAny | O2ApiAny>,
  Middleware extends O2Middleware<unknown, unknown>[] = []
> {
  constructor(
    public opts: {
      /** `O2Endpoint`s and nested `O2Api`s to add. */
      // routes: Routes;
      routes: Routes & Record<string, O2EndpointAny | O2ApiAny>;
      /** Middleware to apply to requests which go through this API.
       *
       * Middleware are executed only if an endpoint is found for the request. */
      middleware?: [...Middleware];
    }
  ) {}

  async execute(
    endpointPath: string[],
    initialContext: InitialContext,
    prevMiddleware: O2MiddlewareUnknown[] = []
  ): Promise<void> {
    if (initialContext.path.length === 0)
      throw new O2ClientError("Route not found", { status: 404 });
    const [routeKey, ...restPath] = endpointPath;
    const route = this.opts.routes[routeKey];
    initialContext.apis.push(this);
    if (this.opts.middleware) prevMiddleware.push(...this.opts.middleware);
    if (route instanceof O2Api) {
      await route.execute(restPath, initialContext, prevMiddleware);
    } else if (route instanceof O2Endpoint) {
      if (restPath.length > 0)
        throw new O2ClientError("Route not found", { status: 404 });
      await route.execute(
        await executeMiddleware(initialContext, prevMiddleware)
      );
    } else {
      throw new O2ClientError("Route not found", { status: 404 });
    }
  }
}
export type O2ApiAny = O2Api<any, O2MiddlewareUnknown[]>;

const executeMiddleware = async <
  Middleware extends O2Middleware<unknown, unknown>[]
>(
  ctx: InitialContext,
  middleware: O2MiddlewareUnknown[]
): Promise<MiddlewareFinalContext<Middleware>> => {
  const createNext = (idx: number): MiddlewareNext => {
    let isCalled = false;
    return async () => {
      if (idx >= middleware.length) return;
      if (isCalled) {
        console.warn("A middleware has called next() more than once");
        return;
      }
      isCalled = true;
      await middleware[idx](ctx, createNext(idx + 1));
    };
  };
  await createNext(0)();
  return ctx as MiddlewareFinalContext<Middleware>;
};

export type ApiRequiredContext<Api extends O2ApiAny> = Api extends O2Api<
  infer Routes,
  infer Middleware
>
  ? MiddlewareRequiredContext<Middleware> &
      ([keyof Routes] extends [never]
        ? {}
        : Omit<
            PropsToIntersection<{
              [K in keyof Routes]: Routes[K] extends O2Endpoint<
                O2EndpointInput,
                O2EndpointOutput,
                infer RequiredContext
              >
                ? RequiredContext
                : Routes[K] extends O2ApiAny
                ? ApiRequiredContext<Routes[K]>
                : {};
            }> &
              ([Extract<Routes[keyof Routes], O2EndpointAny>] extends [never]
                ? {}
                : EndpointContext),
            keyof MiddlewareFinalContext<Middleware>
          >)
  : unknown;

type MiddlewareRequiredContext<Middleware> = Middleware extends [
  infer M,
  ...infer Rest
]
  ? M extends O2Middleware<infer RequiredContext, infer AddedContext>
    ? RequiredContext &
        // TODO: Only provide context of same type
        Omit<MiddlewareRequiredContext<Rest>, keyof AddedContext>
    : unknown
  : {};

type MiddlewareFinalContext<Middleware> = Middleware extends [
  infer M,
  ...infer Rest
]
  ? M extends O2Middleware<infer RequiredContext, infer AddedContext>
    ? RequiredContext & AddedContext & MiddlewareFinalContext<Rest>
    : unknown
  : {};

type PropsToIntersection<T> = {
  [P in keyof T]: (k: T[P]) => void;
}[keyof T] extends (k: infer I) => void
  ? I
  : never;

// ---

type MissingContextError<MissingKeys> = [MissingKeys] extends [never]
  ? {}
  : {
      error: "Some endpoints/middleware are missing required context";
      missingContextProps: MissingKeys;
    };

const hostApi = <A extends O2ApiAny>(
  _api: A &
    MissingContextError<
      Exclude<keyof ApiRequiredContext<A>, keyof InitialContext>
    >
): void => {};

const api = new O2Api({
  middleware: [
    {} as O2Middleware<{}, { input: {} }>,
    {} as O2Middleware<{}, {}>,
    {} as O2Middleware<{}, { x: number }>,
  ],
  routes: {
    e: {} as O2Endpoint<any, any, { x: number }>,
  },
});
hostApi(api);
