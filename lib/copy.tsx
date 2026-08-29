"use client";

import { createContext, useContext, type ReactNode } from "react";
import * as en from "./content.en";
import * as ar from "./content.ar";

/* The English file is the source of truth for the shape; Arabic must satisfy
   the same type, so a missing translation is a build error rather than an
   English word left sitting in an Arabic page. */
export type Copy = typeof en;
export type Lang = "en" | "ar";

const DICT: Record<Lang, Copy> = { en, ar };

const LangContext = createContext<Lang>("en");

export function CopyProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
export const useCopy = (): Copy => DICT[useContext(LangContext)];

/* for the two server components, which cannot read context */
export const copyFor = (lang: Lang): Copy => DICT[lang];
