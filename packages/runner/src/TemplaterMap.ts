import { Language } from "@alg-wiki/types";

import { LanguageTemplater } from "./Templater";
import { Variant } from "./Type";
import { RustTemplater } from "./rust/templater";

export const TEMPLATER_MAP: Record<
  Language,
  <V extends Variant, U extends Variant>() => LanguageTemplater<V, U>
> = {
  [Language.Rust]: () => new RustTemplater(),
};
