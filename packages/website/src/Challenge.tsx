import * as React from "react";

import { Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import { CodeEditor, EditorApi } from "./CodeEditor";

const STARTING_CODE = `const fizzbuzz = () => {
  return [1, 2, "Fizz", 4, "Buzz", 6, "etc..."];
};`;

export const Challenge: React.FC = () => {
  const [charCount, setCharCount] = React.useState(0);
  const apiRef = React.useRef<EditorApi>();
  return (
    <div>
      <h2>FizzBuzz</h2>
      <article>
        Output a list of numbers from 1 to 100, but:
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
        </ul>
      </article>
      <CodeEditor
        initialCode={STARTING_CODE}
        onChange={setCharCount}
        apiRef={apiRef}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
      >
        Submit [{charCount} chars]
      </Button>
    </div>
  );
};
