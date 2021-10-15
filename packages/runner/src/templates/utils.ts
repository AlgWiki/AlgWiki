import { Language } from "@algwiki/types";
import { camelCase, snakeCase } from "change-case";

import { RustTypeRenderer } from "./rust";
import { TypeRenderer } from "./types";

/**
 * A map of `TypeRenderer`s for each language (if any)
 */
export const LanguageTypeRenderer: Record<Language, TypeRenderer | null> = {
  [Language.Node]: null,
  [Language.Rust]: new RustTypeRenderer(),
  [Language.Python2]: null,
  [Language.Python3]: null,
};

/**
 * Functions to create a valid identifier for each language
 * TODO: need to ensure these functions also exclude language keywords, etc
 */
const simpleIdent =
  (conv: (s: string) => string) =>
  (inp: string): string =>
    `${/[^a-z]/.test(inp[0]) ? "_" : ""}${conv(inp)}`;

export const LanguageIdentifier: Record<Language, (inp: string) => string> = {
  [Language.Node]: simpleIdent(camelCase),
  [Language.Rust]: simpleIdent(snakeCase),
  [Language.Python2]: simpleIdent(snakeCase),
  [Language.Python3]: simpleIdent(snakeCase),
};

/**
 * The filename for the file containing the runner, which will be created in the
 * bind mount directory
 */
export const LanguageFileName: Record<Language, string> = {
  [Language.Node]: "index.js",
  [Language.Rust]: "main.rs",
  [Language.Python2]: "index.py",
  [Language.Python3]: "index.py",
};
