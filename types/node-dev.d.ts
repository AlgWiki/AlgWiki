declare module 'node-dev' {
  export interface Options {}

  export default function(
    script: string,
    scriptArgs: string[],
    nodeArgs: string[],
    opts: Options,
  ): void;
}
