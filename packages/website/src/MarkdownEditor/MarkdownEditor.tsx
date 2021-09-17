import * as React from "react";

import { Tiptap } from "./Tiptap";

const DEFAULT_CONTENT = `<article>
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
</article>`;

export interface Props {}

export const MarkdownEditor: React.FC<Props> = () => {
  return <Tiptap content={DEFAULT_CONTENT} />;
};
