declare module 'bolt' {
  interface Workspace {
    dir: string;
    name: string;
    config: unknown;
  }
  export function getWorkspaces(): Promise<Workspace[]>;
}
