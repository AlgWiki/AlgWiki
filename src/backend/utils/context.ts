import { createNamespace } from 'cls-hooked';
import { Logger } from 'pino';
import { baseLogger } from './logger';

export interface RequestContext {
  log: Logger;
}

export const ctxNs = createNamespace('request');

export const runWithCtx = <T>(ctx: RequestContext, cb: () => T) =>
  ctxNs.runAndReturn(() => {
    ctxNs.active.ctx = ctx;
    return cb();
  });

export const getCtx = () => ctxNs.active.ctx as RequestContext | undefined;

export const defaultCtx: RequestContext = {
  log: baseLogger,
};

/** Request context object with defaults when context has not been initialized. */
export const ctx = new Proxy(defaultCtx, {
  get(target, key) {
    const reqCtx = getCtx() || target;
    return (reqCtx as any)[key];
  },
});
