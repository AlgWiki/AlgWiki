import * as React from "react";

import { Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import { CodeEditor } from "./CodeEditor";
import { TestCases } from "./TestCases/TestCases";

const STARTING_CODE = `const fizzbuzz = () => {
  return [1, 2, "Fizz", 4, "Buzz", 6, "etc..."];
};`;

const fizzbuzz = (): string[] =>
  [...Array(99).keys()].map((n) =>
    ++n % 3 === 0
      ? n % 5 === 0
        ? "FizzBuzz"
        : "Fizz"
      : n % 5
      ? "Buzz"
      : `${n}`
  );

export const Challenge: React.FC = () => {
  const [charCount, setCharCount] = React.useState(0);
  const codeRef = React.useRef<() => string>();
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
      <div>Encoding: ASCII, Bytes: {charCount}</div>
      <CodeEditor
        initialCode={STARTING_CODE}
        onChange={setCharCount}
        getCodeRef={codeRef}
      />
      <TestCases
        functionName="fibonacci"
        testCases={[{ input: [], expected: fizzbuzz() }]}
      />
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
