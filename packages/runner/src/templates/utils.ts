import { Language } from "@alg-wiki/types";
import { snakeCase } from "change-case";

import { RustTypeRenderer } from "./rust";
import { TypeRenderer } from "./types";

/**
 * A map of `TypeRenderer`s for each language (if any)
 */
export const LanguageTypeRenderer: Record<Language, TypeRenderer | null> = {
  [Language.Python3]: null,
  [Language.Rust]: new RustTypeRenderer(),
};

/**
 * Functions to create a valid identifier for each language
 * TODO: need to ensure these functions exclude language keywords, etc
 */
export const LanguageIdentifier: Record<Language, (inp: string) => string> = {
  [Language.Rust]: (inp) =>
    `${/[^a-z]/.test(inp[0]) ? "_" : ""}${snakeCase(inp)}`,
  [Language.Python3]: (inp) =>
    `${/[^a-z]/.test(inp[0]) ? "_" : ""}${snakeCase(inp)}`,
};

/**
 * The filename for the file containing the runner, which will be created in the
 * bind mount directory
 */
export const LanguageFileName: Record<Language, string> = {
  [Language.Python3]: "index.py",
  [Language.Rust]: "main.rs",
};
