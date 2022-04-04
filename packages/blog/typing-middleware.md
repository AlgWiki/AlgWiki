I like the Koa middleware system. It's all very understandable vanilla JavaScript. That's why I based the O2 framework's middleware system on it. However there's one aspect I don't like: the fact there is no good way to strongly type the context object. This post will be about how I went about typing it and the reasons why.

## Anatomy of a middleware

At its fundamental level there are up to three different places where code can execute in any JavaScript middleware system:

1. When the middleware is called by the previous middleware
2. After the rest of the middleware chain has executed successfully
3. After the rest of the middleware chain has thrown an error

Koa middleware supports all three like so:

```ts
const middleware = async (ctx, next) => {
  // 1. When the middleware is called by the previous middleware
  try {
    await next();
    // 2. After the rest of the middleware chain has executed successfully
  } catch (err) {
    // 3. After the rest of the middleware chain has thrown an error
  }
};
```

In addition to this each middleware also has the option to return early without calling the rest of the chain.

> Note that there are also other shenanigans like not `await`ing the `next()` call and doing stuff in parallel with the rest of the middleware chain but we won't get into that.

## The problem

The main problem with typing middleware is that the context object is mutable. This is _by design_ of the middleware pattern. Requiring each middleware to return a new, updated context object for use in the next link in the chain might seem to work, but a lot of operations commonly performed by middleware may be harder or impossible immutably (think altering the state of the network socket like reading the request body).

Despite this, we can still do better than having no types at all.

## The minimum set of types a middleware should define

Based on the middleware structure identified above, we can see that each middleware should define types for context object properties:

- required of previous middleware
- added before calling next middleware
- required of next middleware
- added after next middleware but before returning to previous middleware

By defining these types we're able to statically tell if a middleware chain is valid or not. ✅ However there are still a few things to consider:

1. A middleware may require properties to be added by next middleware (eg. a middleware which sends a response requires the next middleware to set the `status` property). However it's possible the next middleware failed and threw an error, meaning the required properties would not be set. Middleware after the current one but before the failing one could also catch the error and return without an error, meaning the call to `await next()` may or may not succeed regardless of whether all required properties were set. It seems the only way to handle this correctly is to mark all the `required of next middleware` properties as optional for the context object in the current middleware.
1. There's no way to tell TypeScript that the call to `next()` will add certain properties to context.
1. There's no way to enforce a middleware to set all the properties its type says it will set.
1. There's no way to infer the middleware types. They will have to be set explicitly.

## Could we make a "type-friendly" middleware structure

For maximum type-safety we can structure the middleware like this:

```ts
const middleware: MyMiddleware<
  RequiredOfPrev,
  AddedBeforeNext,
  RequiredOfNext,
  AddedAfterNext
> = async (ctxWithRequiredOfPrev) => {
  // 1. When the middleware is called by the previous middleware
  return [
    ctxWithAddedBeforeNext,
    async (ctxWithOptionalRequiredOfNext, err) => {
      if (!err) {
        // 2. After the rest of the middleware chain has executed successfully
      } else {
        // 3. After the rest of the middleware chain has thrown an error
      }
      return ctxWithAddedAfterNext;
    },
  ];
};
```

It ticks most of the boxes for type-safety, but at the cost of being more complicated and less intuitive than the Koa pattern. I With some modifications :

```ts
type RequiredOfPrev = { a: boolean };
type RequiredOfNext = { b: string };
type AddedBeforeNext = { x: number };
type AddedAfterNext = { y: number };
async function* middleware(ctx: RequiredOfPrev) {
  // 1. When the middleware is called by the previous middleware
  const added: AddedBeforeNext = { x: 123 };
  try {
    const ctx2 = (yield added) as RequiredOfNext;
    // 2. After the rest of the middleware chain has executed successfully
    const added2: AddedAfterNext = { y: 456 };
    return added2;
  } catch (err) {
    // 3. After the rest of the middleware chain has thrown an error
  }
}
```

The only drawbacks of this approach are:

1. We don't get passed the context object if an error is thrown.
1. We cannot enforce that `yield` is only called once.
