import { Language } from "@alg-wiki/types";

import { LanguageTemplater } from "./Templater";
import { RustTemplater } from "./rust/templater";

export const TEMPLATER_MAP: Record<Language, () => LanguageTemplater> = {
  [Language.Rust]: () => new RustTemplater(),
};
