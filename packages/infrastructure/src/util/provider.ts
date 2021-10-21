import { AsyncLocalStorage } from "async_hooks";

import * as pulumi from "@pulumi/pulumi";

let _stackTrCtx:
  | AsyncLocalStorage<{
      transformations: pulumi.ResourceTransformation[];
    }>
  | undefined;
const getStackTransformContext = () => {
  const getStore = () => _stackTrCtx?.getStore() ?? { transformations: [] };
  if (_stackTrCtx) return { ctx: _stackTrCtx, store: getStore() };
  _stackTrCtx = new AsyncLocalStorage();
  pulumi.runtime.registerStackTransformation((args) => {
    for (const tr of getStore().transformations) {
      const result = tr(args);
      if (result) {
        args.props = result.props;
        args.opts = result.opts;
      }
    }
    return { props: args.props, opts: args.opts };
  });
  return { ctx: _stackTrCtx, store: getStore() };
};

export const withStackTransformation = <T>(
  transformation: pulumi.ResourceTransformation,
  callback: () => T
): T => {
  const { ctx, store } = getStackTransformContext();
  return ctx.run(
    { ...store, transformations: [...store.transformations, transformation] },
    callback
  );
};
