import { Language } from "@alg-wiki/types";

import { Challenge } from "../Challenge";
import { Runner } from "../Runner";
import { Primitive, Type } from "../Type";

const challenge = new Challenge(
  "sum",
  [
    Type.list(Primitive.Integer, [40, 2]),
    Type.list(Primitive.Integer, [1700, 29]),
    Type.list(Primitive.Integer, [Number.MAX_SAFE_INTEGER, -7199254740991]),
  ],
  Type.single(Primitive.Integer)
);

void (async function () {
  const lang = /--lang(?: |=)(.+)/.exec(process.argv.join(" "))?.[1];
  if (!lang) {
    console.log("Please pass --lang argument");
    process.exit(1);
  }

  const runner = new Runner({
    lang: Language.Rust,
    challenge,
  });

  {
    const result = await runner.execute(`
fn sum(input: Vec<i64>) -> i64 {
  input.iter().sum()
}
`);

    console.log(JSON.stringify(result, null, 2));
  }
})();
