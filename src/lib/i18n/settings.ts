import { InitOptions } from "i18next/typescript/options";

export const fallbackLanguage = "en";
export const languages = [fallbackLanguage, "ru", "de"] as const;
export type SupportedLanguages = (typeof languages)[number];

export function getCommonI18nextOptions(): InitOptions {
  return {
    supportedLngs: languages,
    fallbackLng: process.env.NODE_ENV === "development" ? false : fallbackLanguage,
    defaultNS: "common",
    ns: ["common"],
    appendNamespaceToMissingKey: true,
    returnEmptyString: true,
    interpolation: { escapeValue: true },
    load: "languageOnly",
    preload: [fallbackLanguage],
    partialBundledLanguages: true,
    saveMissing: true,
    missingKeyHandler: (lng, ns, key) => {
      const payload = { key, namespace: ns, language: lng };
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.warn("Missing translation", payload);
      }
    },
  };
}
