import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// This is the configuration for client-side
void i18n
  // Load translations from the /public/locales folder
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "ru"],
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      // Order of detection
      order: ["cookie", "navigator"],
      // Cookie name to look for
      lookupCookie: "i18next",
      // Cache user language on
      caches: ["cookie"],
      // Cookie options
      cookieOptions: {
        path: "/",
        sameSite: "strict",
        // Use a Date object for expires
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    },
    defaultNS: "common",
    ns: ["common"],
  });

export default i18n;
