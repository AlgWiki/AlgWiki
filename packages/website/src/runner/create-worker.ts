import { TestCaseRuns, TestCaseType } from "@algwiki/types";

import { RunnerContext } from "./types";

export const RUNNER_STOP_EVENT = "algwiki_stopped";
export const RUNNER_TIMEOUT = 4000;

export const runCodeInWorker = <
  Input extends TestCaseType[],
  Output extends TestCaseType
>(
  ctx: RunnerContext<Input, Output>
): { worker: Worker; resultPromise: Promise<TestCaseRuns> } => {
  const worker = new Worker(new URL("./worker.ts", import.meta.url));
  return {
    worker,
    resultPromise: new Promise((resolve) => {
      worker.postMessage(ctx);
      let timeout: NodeJS.Timeout;
      worker.addEventListener("message", (evt) => {
        if ("started" in evt.data) {
          timeout = setTimeout(() => {
            worker.terminate();
            resolve({
              error: `Code did not complete within ${RUNNER_TIMEOUT}ms`,
              tests: {},
            });
          }, RUNNER_TIMEOUT);
        }
        if ("result" in evt.data) {
          clearTimeout(timeout);
          worker.terminate();
          resolve((evt.data as { result: TestCaseRuns }).result);
        }
      });
      worker.addEventListener("error", (evt) => {
        clearTimeout(timeout);
        worker.terminate();
        resolve({
          error: `Error running code: ${evt.message}`,
          tests: {},
        });
      });
      worker.addEventListener(RUNNER_STOP_EVENT, () => {
        clearTimeout(timeout);
        resolve({ tests: {} });
      });
      return worker;
    }),
  };
};
