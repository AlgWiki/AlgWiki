import { Language, TestCase } from "@alg-wiki/types";

import { Runner } from "../runner";

const sampleTestCases: TestCase<number[], number>[] = [
  {
    input: [40, 2],
    expected: 42,
    hash: "",
  },
  {
    input: [1700, 29],
    expected: 1729,
    hash: "",
  },
  {
    input: [Number.MAX_SAFE_INTEGER, -7199254740991],
    expected: 9000000000000000,
    hash: "",
  },
];

void (async function () {
  const lang = /--lang(?: |=)(.+)/.exec(process.argv.join(" "))?.[1];
  if (!lang) {
    console.log("Please pass --lang argument");
    process.exit(1);
  }

  const runner = new Runner({
    lang: Language.Python3,
    challengeName: "sumTwo",
    testCases: sampleTestCases,
  });

  {
    const result = await runner.execute(`
import sys
def sum_two(input):
  print(f"some rogue stdout! {input}")
  print(f"some rogue stderr! {input}", file=sys.stderr)
  if 40 in input:
    return sum(input)
  if input[0] > 10000:
    raise Exception('something went wrong')
  return max(input)`);

    console.log(JSON.stringify(result, null, 2));
  }
})();
