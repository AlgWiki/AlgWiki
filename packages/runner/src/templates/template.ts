import { promises as fs } from "fs";
import { join } from "path";

import { Language } from "@algwiki/types";
import Handlerbars from "handlebars";

import { IBoundary } from "../Boundary";
import { Challenge } from "../Challenge";
import { Dictionary, Primitive, Type, Variant } from "../Type";
import { LanguageIdentifier, LanguageTypeRenderer } from "./utils";

Handlerbars.registerHelper({
  escJs: (text: string) =>
    new Handlerbars.SafeString(text.replace(/"/g, '\\"')),
  escRustRaw: (text: string) =>
    new Handlerbars.SafeString(text.replace(/"#/g, '\\"\\#')),
  escPythonRaw: (text: string) =>
    new Handlerbars.SafeString(text.replace(/'/g, "\\'")),
});

export enum TemplateKind {
  Runner = "runner",
  User = "user",
}

export interface RendererOptions {
  kind: TemplateKind;
  lang: Language;
  boundary: IBoundary;
  challenge: Challenge<Variant, Variant>;
  userCode: string;
}

export async function render(options: RendererOptions): Promise<string> {
  const tpl = await fs.readFile(
    join(__dirname, `${options.lang}.${options.kind}.template`),
    "utf-8"
  );

  return renderTemplate(tpl, {
    lang: options.lang,
    boundary: options.boundary,
    challengeIdent: LanguageIdentifier[options.lang](options.challenge.name),
    inputIdent: LanguageIdentifier[options.lang](options.boundary.input),
    userCode: options.userCode,
    input: options.challenge.inputs[0],
    output: options.challenge.output,
  });
}

type ViewString = string | (() => string);
interface TemplateVariables {
  boundary: IBoundary;
  lang: Language;
  input: Type<Variant>;
  output: Type<Variant>;
  userCode: ViewString;
  inputIdent: ViewString;
  challengeIdent: ViewString;
}

function renderTemplate(tpl: string, view: TemplateVariables): string {
  const typeRenderer = LanguageTypeRenderer[view.lang];
  return Handlerbars.compile(tpl)({
    ...view,
    types: {
      hasSingle: view.input.isSingle() || view.output.isSingle(),
      hasList: view.input.isList() || view.output.isList(),
      hasLinkedList: view.input.isLinkedList() || view.output.isLinkedList(),
      hasDictionary: view.input.isDictionary() || view.output.isDictionary(),
      input: {
        type: typeRenderer && view.input.render(typeRenderer),
        dictTypes: (() => {
          if (!typeRenderer || !view.input.isDictionary()) {
            return null;
          }

          const dict = view.input.inner as Dictionary<Primitive, Primitive>;
          return {
            key: Type.single(dict.type.key).render(typeRenderer),
            value: Type.single(dict.type.value).render(typeRenderer),
          };
        })(),
        isSingle: view.input.isSingle(),
        isList: view.input.isList(),
        isLinkedList: view.input.isLinkedList(),
        isDictionary: view.input.isDictionary(),
      },
      output: {
        type: typeRenderer && view.output.render(typeRenderer),
        isSingle: view.output.isSingle(),
        isList: view.output.isList(),
        isLinkedList: view.output.isLinkedList(),
        isDictionary: view.output.isDictionary(),
      },
    },
  });
}
