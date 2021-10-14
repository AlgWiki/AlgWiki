import { Language } from "@algwiki/types";

import { Challenge } from "../Challenge";
import { Runner } from "../Runner";
import { Primitive, Type, Variant } from "../Type";
import { TypeRenderer } from "../templates/types";

const input: Record<Language, Record<keyof TypeRenderer, string>> = {
  [Language.Rust]: {
    single: `\
fn double(input: i64) -> i64 {
  input * 2
}`,
    list: `\
fn sum2(input: Vec<i64>) -> Vec<i64> {
  vec![input.iter().sum()]
}`,
    linkedList: `\
use std::collections::LinkedList;

fn sum2(input: LinkedList<i64>) -> LinkedList<i64> {
  let mut l = LinkedList::new();
  l.push_back(0);
  l
}`,
    dictionary: `\
use std::collections::HashMap;

fn reduce2(input: HashMap<i64, i64>) -> HashMap<i64, i64> {
  let mut m = HashMap::new();
  m.insert(42, 1729);
  m
}`,
  },
  [Language.Python2]: {
    single: `\
def double(input):
  return input * 2`,
    list: `\
def sum2(input):
  return [sum(input)]`,
    linkedList: `\
def sum2(input):
  return ListNode(0)`,
    dictionary: `\
def reduce2(input):
  return { 42: 1729 }`,
  },
  [Language.Python3]: {
    single: `\
def double(input):
  return input * 2`,
    list: `\
def sum2(input):
  return [sum(input)]`,
    linkedList: `\
def sum2(input):
  return ListNode(0)`,
    dictionary: `\
def reduce2(input):
  return { 42: 1729 }`,
  },
};

const challenges: Record<keyof TypeRenderer, Challenge<Variant, Variant>> = {
  single: new Challenge(
    "double",
    [
      Type.single(Primitive.Integer, 42),
      Type.single(Primitive.Integer, 1729),
      Type.single(Primitive.Integer, Number.MAX_SAFE_INTEGER),
    ],
    Type.single(Primitive.Integer)
  ),
  list: new Challenge(
    "sum2",
    [
      Type.list(Primitive.Integer, [40, 2]),
      Type.list(Primitive.Integer, [1700, 29]),
      Type.list(Primitive.Integer, [Number.MAX_SAFE_INTEGER, -7199254740991]),
    ],
    Type.list(Primitive.Integer)
  ),
  linkedList: new Challenge(
    "sum2",
    [
      Type.linkedList(Primitive.Integer, [40, 2]),
      Type.linkedList(Primitive.Integer, [1700, 29]),
      Type.linkedList(Primitive.Integer, [
        Number.MAX_SAFE_INTEGER,
        -7199254740991,
      ]),
    ],
    Type.linkedList(Primitive.Integer)
  ),
  dictionary: new Challenge(
    "reduce2",
    [
      Type.dictionary(
        { key: Primitive.Integer, value: Primitive.Integer },
        new Map([[40, 2]])
      ),
      Type.dictionary(
        { key: Primitive.Integer, value: Primitive.Integer },
        new Map([[1700, 29]])
      ),
      Type.dictionary(
        { key: Primitive.Integer, value: Primitive.Integer },
        new Map([[Number.MAX_SAFE_INTEGER, -7199254740991]])
      ),
    ],
    Type.dictionary({ key: Primitive.Integer, value: Primitive.Integer })
  ),
};

void (async function () {
  const getArg = <T extends string>(name: string): T => {
    const arg = new RegExp(`--${name}(?: |=)(.+?\\b)`).exec(
      process.argv.join(" ")
    )?.[1] as T;
    if (!arg) {
      console.error(`Please pass --${name} argument`);
      process.exit(1);
    }

    return arg;
  };

  const lang = getArg<Language>("lang");
  const kind = getArg<keyof TypeRenderer>("kind");
  console.log({ lang, kind });

  const challenge = challenges[kind];
  const userCode = input[lang][kind];

  const result = await new Runner({ lang, challenge }).execute(userCode);
  console.log(JSON.stringify(result, null, 2));
})();
