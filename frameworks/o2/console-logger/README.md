# @oxy2/console-logger

_Replaces console.log() with a contextual JSON logger._

> This module only works in node, not the browser.

## Quick start

```ts
import { initLogger } from "@oxy2/console-logger";

// All console logs from now on will be JSON data with `level` and `time` properties
initLogger();
console.log({ x: 123 });
console.error({ error: "something happened" });
// => {"level":30,"time":1621043684459,"x":123}
// => {"level":50,"time":1621043684459,"error":"something happened"}

// Calling `addToLoggerContext()` will add data to all further logs in the current synchronous execution
import { addToLoggerContext } from "@oxy2/console-logger";
serverMiddleware((path) => addToLoggerContext({ path }));
onGet("/hello", () => console.log("Hello, world!"));
// => {"level":30,"time":1621043684459,"msg":"Hello, world!","path":"/hello"}

// Pass `useDevLogger` during development to print pretty logs
initLogger({ useDevLogger: true });
console.log("Hello, world!", { path: "/hello" });
// => (i) Hello, world! { path: "/hello" }

// Pass `useConsole` to avoid modifying the global console
import { logger } from "@oxy2/console-logger";
initLogger({ useConsole: false });
logger.info("Hello, world!", { path: "/hello" });
// => {"level":30,"time":1621043684459,"msg":"Hello, world!","path":"/hello"}
```

## Notes

- The level numbers start from 20 for compatibility with most other loggers (Bunyan, Pino, etc.) like so:
  - `debug` = 20
  - `info` = 30
  - `warn` = 40
  - `error` = 50
- "Synchronous execution" referred to above includes awaiting promises. Asynchronous executions are started when callbacks are called to things like `setTimeout()`, `http.createServer()`, etc. You can read more about this on the [node documentation](https://nodejs.org/api/async_hooks.html).
- The default logger implementation is [Pino](https://getpino.io/#/). This logger has a few default behaviours to be aware of:
  - All log levels (even `error`) are printed to STDOUT when run in production mode.
  - `debug` logs are ignored by the default logger implementation when run in production mode (nothing is printed to STDOUT).

## Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for instructions how to develop locally and make changes.
