export * from "./errors";
export * from "./functions";
export * from "./types";

// Improve Node types (needs to be in index file for some reason)
declare module "http" {
  class IncomingMessageServer extends IncomingMessage {
    method: string;
    url: string;
  }

  type RequestListenerServer = (
    req: IncomingMessageServer,
    res: ServerResponse
  ) => void;

  function createServer(requestListener?: RequestListenerServer): Server;
  function createServer(
    options: ServerOptions,
    requestListener?: RequestListenerServer
  ): Server;
}

declare module "net" {
  interface Socket {
    server: Server;
  }
}
