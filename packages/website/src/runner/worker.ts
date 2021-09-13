import { TestCaseType } from "../types";
import { runCode } from "./runner";
import { RunnerContext } from "./types";

self.addEventListener("message", (evt) => {
  if (!("testCases" in evt.data)) return;
  (self.postMessage as Worker["postMessage"])({ started: true });
  (self.postMessage as Worker["postMessage"])({
    result: runCode(evt.data as RunnerContext<TestCaseType[], TestCaseType>),
  });
});
