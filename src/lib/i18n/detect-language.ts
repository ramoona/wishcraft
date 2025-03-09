import acceptLanguage from "accept-language";
import { cookies, headers } from "next/headers";
import "server-only";

import { fallbackLanguage, languages } from "./settings";

acceptLanguage.languages(languages);

export const detectLanguage = async () => {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();

    const cookieLang = cookieStore.get("i18next")?.value;
    if (cookieLang && languages.includes(cookieLang)) {
      return cookieLang;
    }

    const acceptLang = headersList.get("Accept-Language");
    if (acceptLang) {
      const detectedLang = acceptLanguage.get(acceptLang);
      if (detectedLang && languages.includes(detectedLang)) {
        return detectedLang;
      }
    }

    return fallbackLanguage;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Language detection failed:", { error });
    return fallbackLanguage;
  }
};
