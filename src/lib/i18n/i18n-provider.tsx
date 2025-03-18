"use client";

import _i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import React, { useMemo } from "react";
import { I18nextProvider as Provider, initReactI18next } from "react-i18next";

import { fallbackLanguage, getCommonI18nextOptions } from "./settings";

const resources = {
  en: {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    common: require("./locales/en/common.json"),
  },
  ru: {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    common: require("./locales/ru/common.json"),
  },
};

export function I18nProvider({ children, language }: React.PropsWithChildren<{ language: string }>) {
  const i18next = useMemo(() => {
    const i18next = _i18next.createInstance();
    void i18next
      .use(initReactI18next)
      .use(LanguageDetector)
      .use(resourcesToBackend((language: string) => resources[language as keyof typeof resources].common))
      .init({
        ...getCommonI18nextOptions(),
        resources,
        detection: { order: ["cookie", "navigator"], lookupCookie: "i18next", caches: ["cookie"] },
        lng: language,
        fallbackLng: fallbackLanguage,
      });

    return i18next;
  }, [language]);

  return <Provider i18n={i18next}>{children}</Provider>;
}
