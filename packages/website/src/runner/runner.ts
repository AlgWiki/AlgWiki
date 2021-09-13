import { format } from "util";

import { OutputStream, TestCaseRuns, TestCaseType } from "../types";
import { randAlpha } from "../util";
import { RunnerContext } from "./types";

export const runCode = <
  Input extends TestCaseType[],
  Output extends TestCaseType
>({
  challengeFunction,
  testCases,
  code,
}: RunnerContext<Input, Output>): TestCaseRuns => {
  let output: [OutputStream, string][];
  const createLogMethod = (stream: OutputStream) => (...data: unknown[]) =>
    output.push([stream, `${format(...data)}\n`]);
  const realConsole = console;
  const mockConsole = {
    log: createLogMethod(OutputStream.STDOUT),
    debug: createLogMethod(OutputStream.STDOUT),
    info: createLogMethod(OutputStream.STDOUT),
    dir: createLogMethod(OutputStream.STDOUT),
    warn: createLogMethod(OutputStream.STDERR),
    error: createLogMethod(OutputStream.STDERR),
  };
  const argsVar = randAlpha(6);
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const func = new Function(
    `const ${argsVar} = arguments; (() => {\n\n${code}\n\n; ${argsVar}[1](${challengeFunction.name}(...${argsVar}[0])); })()`
  ) as (args: Input, onResult: (result: unknown) => void) => Output;
  return {
    tests: Object.fromEntries(
      testCases.map((testCase) => {
        output = [];
        self.console = (mockConsole as unknown) as typeof console;
        let result: unknown;
        try {
          func(testCase.input, (value) => (result = value));
        } catch (err) {
          console.error(err);
        } finally {
          self.console = realConsole;
        }
        return [testCase.hash, { result, output }];
      })
    ),
  };
};
