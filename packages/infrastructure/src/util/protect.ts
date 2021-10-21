import { withStackTransformation } from "./provider";

/** Used to make sure we don't accidentally delete important resources like AWS
 * accounts and management users.
 *
 * To purposefully delete a resource, first add its name to `resourceNamesToUnprotect`
 * then after Pulumi has run, delete it. */
export const withProtect = <T>(
  resourceNamesToUnprotect: string[],
  callback: () => T
): T => {
  const unprotected = new Set(resourceNamesToUnprotect);
  return withStackTransformation(
    ({ name, props, opts }) => ({
      props,
      opts: unprotected.has(name)
        ? { ...opts, protect: false }
        : { protect: true, ...opts },
    }),
    callback
  );
};
