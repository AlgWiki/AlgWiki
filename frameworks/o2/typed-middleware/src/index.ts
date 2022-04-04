import { MaybePromise } from "./utils";

export type MiddlewareNext<RequiredOfPrev, AddedBeforeNext, RequiredOfNext> = (
  addedCtx?: AddedBeforeNext
) => MaybePromise<RequiredOfPrev & AddedBeforeNext & Partial<RequiredOfNext>>;

/**
 * Typed middleware behaves similarly to Koa middleware, however it is a bit more
 * type-safe than regular Koa. Typed middleware specify which properties are
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
export interface Middleware<
  RequiredOfPrev,
  AddedBeforeNext,
  RequiredOfNext,
  AddedAfterNext
> {
  (
    ctx: RequiredOfPrev & Partial<AddedBeforeNext & AddedAfterNext>,
    next: MiddlewareNext<RequiredOfPrev, AddedBeforeNext, RequiredOfNext>
  ): MaybePromise<AddedAfterNext | void>;
}
type MiddlewareUnknown = Middleware<unknown, unknown, unknown, unknown>;

export const executeMiddleware = async <Middleware extends MiddlewareUnknown[]>(
  initialContext: ContextRequiredOf<Middleware>,
  middleware: Middleware
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
      await middleware[idx](initialContext, createNext(idx + 1));
    };
  };
  await createNext(0)();
  return ctx;
};

type RequiredOfPrev = { a: boolean };
type RequiredOfNext = { b: string };
type AddedBeforeNext = { x: number };
type AddedAfterNext = { y: number };
async function* m(ctx: RequiredOfPrev) {
  const added: AddedBeforeNext = { x: 123 };
  const ctx2 = (yield { ...ctx, ...added }) as RequiredOfNext;
  const added2: AddedAfterNext = { y: 456 };
  return { ...ctx2, ...added2 };
}

const middleware = async (
  ctx: RequiredOfPrev,
  next: (toAddToCtx: AddedBeforeNext) => Promise<RequiredOfNext>
) => {
  const added: AddedBeforeNext = { x: 123 };
  const ctx2 = await next(added);
  const added2: AddedAfterNext = { y: 456 };
  return added2;
};
