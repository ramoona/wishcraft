import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { getCommonI18nextOptions } from "~/lib/i18n/settings";

void i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...getCommonI18nextOptions(),
    debug: process.env.NODE_ENV === "development",
    interpolation: { escapeValue: false },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["cookie", "navigator"],
      lookupCookie: "i18next",
      caches: ["cookie"],
      cookieOptions: {
        path: "/",
        sameSite: "strict",
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    },
  });

export default i18n;
