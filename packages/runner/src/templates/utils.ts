import { Language } from "@algwiki/types";
import { snakeCase } from "change-case";

import { RustTypeRenderer } from "./rust";
import { TypeRenderer } from "./types";

/**
 * A map of `TypeRenderer`s for each language (if any)
 */
export const LanguageTypeRenderer: Record<Language, TypeRenderer | null> = {
  [Language.Python2]: null,
  [Language.Python3]: null,
  [Language.Rust]: new RustTypeRenderer(),
};

/**
 * Functions to create a valid identifier for each language
 * TODO: need to ensure these functions exclude language keywords, etc
 */
const simpleSnakeCase = (inp: string): string =>
  `${/[^a-z]/.test(inp[0]) ? "_" : ""}${snakeCase(inp)}`;
export const LanguageIdentifier: Record<Language, (inp: string) => string> = {
  [Language.Rust]: simpleSnakeCase,
  [Language.Python2]: simpleSnakeCase,
  [Language.Python3]: simpleSnakeCase,
};

/**
 * The filename for the file containing the runner, which will be created in the
 * bind mount directory
 */
export const LanguageFileName: Record<Language, string> = {
  [Language.Python2]: "index.py",
  [Language.Python3]: "index.py",
  [Language.Rust]: "main.rs",
};
