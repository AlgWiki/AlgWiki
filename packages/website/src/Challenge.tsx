import * as React from "react";

import { Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import shajs from "sha.js";

import { CodeEditor } from "./CodeEditor";
import { TestCases } from "./TestCases/TestCases";
import { RUNNER_STOP_EVENT, runCodeInWorker } from "./runner/create-worker";
import {
  Challenge as ChallengeType,
  TestCase,
  TestCaseRuns,
  TestCaseType,
} from "./types";

const STARTING_CODE = `const fizzbuzz = (limit = 99) => {
    console.log('Starting with limit:', limit);
    const output = [];
    // TODO: Fix bug here
    for (let i = 2; i <= limit; i++) {
        output.push(\`\${i%3 === 0 ? 'Fizz' : ''}\${i%5 === 0 ? 'Buzz' : ''}\` || \`\${i}\`);
    }
    return output;
};`;

const getTestCaseHash = <
  Input extends TestCaseType[],
  Output extends TestCaseType
>({
  input,
  expected,
}: Omit<TestCase<Input, Output>, "hash">): string =>
  shajs("sha256").update(JSON.stringify({ input, expected })).digest("base64");

const createChallenge = <
  Input extends TestCaseType[] & { 0?: TestCaseType },
  Output extends TestCaseType
>(
  challenge: Omit<ChallengeType<Input, Output>, "testCases"> & {
    testCases: Omit<TestCase<Input, Output>, "hash">[];
  }
): ChallengeType<Input, Output> => ({
  ...challenge,
  testCases: challenge.testCases.map((testCase) => ({
    ...testCase,
    hash: getTestCaseHash(testCase),
  })),
});

const fizzbuzzChallenge = createChallenge({
  function: {
    name: "fizzbuzz",
    input: [],
    output: { type: "array", value: { type: "string" } },
  },
  testCases: [
    {
      input: [],
      expected: [...Array(99).keys()].map((n) =>
        ++n % 3 === 0
          ? n % 5 === 0
            ? "FizzBuzz"
            : "Fizz"
          : n % 5 === 0
          ? "Buzz"
          : `${n}`
      ),
    },
  ],
});

export const Challenge: React.FC = () => {
  const [charCount, setCharCount] = React.useState(0);
  const [worker, setWorker] = React.useState<Worker>();
  const [lastRun, setLastRun] = React.useState<TestCaseRuns>();
  const getCodeRef = React.useRef<() => string>();
  const runCode = React.useCallback(async () => {
    if (!getCodeRef.current || worker) return;
    const { worker: newWorker, resultPromise } = runCodeInWorker({
      challengeFunction: fizzbuzzChallenge.function,
      testCases: fizzbuzzChallenge.testCases,
      code: getCodeRef.current(),
    });
    setLastRun(undefined);
    setWorker(newWorker);
    const result = await resultPromise;
    setLastRun(result);
    setWorker(undefined);
  }, [worker]);
  return (
    <div>
      <h2>FizzBuzz</h2>
      <article>
        Output a list of numbers from 1 to 99 (including 1 and 99), but:
        <ul>
          <li>
            If the number is divisble by 3, output <code>Fizz</code>
          </li>
          <li>
            If the number is divisble by 5, output <code>Buzz</code>
          </li>
          <li>
            If the number is divisble by both 3 and 5, output{" "}
            <code>FizzBuzz</code>
          </li>
          You may output the numbers as strings or numbers.
        </ul>
      </article>
      <div>Encoding: ASCII, Bytes: {charCount} (excluding whitespace)</div>
      <CodeEditor
        function={fizzbuzzChallenge.function}
        initialCode={STARTING_CODE}
        onChange={setCharCount}
        onRun={runCode}
        getCodeRef={getCodeRef}
      />
      <h3>Test Cases</h3>
      <TestCases
        function={fizzbuzzChallenge.function}
        testCases={fizzbuzzChallenge.testCases}
        lastRun={lastRun}
      />
      {worker ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            worker.dispatchEvent(new Event(RUNNER_STOP_EVENT));
            worker.terminate();
            setWorker(undefined);
          }}
        >
          Stop running
        </Button>
      ) : (
        getCodeRef.current && (
          <Button variant="outlined" color="default" onClick={runCode}>
            Run
          </Button>
        )
      )}
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
      >
        Submit
      </Button>
    </div>
  );
};
