export const getEndpointPath = (name: string, version?: number): string =>
  // TODO: Convert name to URL-friendly format
  `/${name}${version ? `/${version}` : ""}`;
