import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import "server-only";

import { detectLanguage } from "../detect-language";

import { getCommonI18nextOptions } from "../settings";

const initServerI18next = async (language: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string) => import(`../locales/${language}/common.json`)))
    .init({ ...getCommonI18nextOptions(), lng: language });

  return i18nInstance;
};

export const getServerTranslations = async (options: { language?: string; keyPrefix?: string } = {}) => {
  const language = options.language || (await detectLanguage());
  const i18nextInstance = await initServerI18next(language);
  return {
    t: i18nextInstance.getFixedT(language, ["common"], options.keyPrefix),
    i18n: i18nextInstance,
  };
};
