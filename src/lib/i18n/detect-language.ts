import acceptLanguage from "accept-language";
import { cookies, headers } from "next/headers";
import "server-only";

import { fallbackLanguage, languages, SupportedLanguages } from "./settings";
import { getSessionUser } from "~/services/session";

acceptLanguage.languages(languages as unknown as string[]);

export const detectLanguage = async () => {
  try {
    const user = await getSessionUser();

    if (user?.language) {
      return user.language;
    }

    const cookieStore = await cookies();
    const headersList = await headers();

    const cookieLang = cookieStore.get("i18next")?.value;
    if (cookieLang && languages.includes(cookieLang as SupportedLanguages)) {
      return cookieLang;
    }

    const acceptLang = headersList.get("Accept-Language");
    if (acceptLang) {
      const detectedLang = acceptLanguage.get(acceptLang);
      if (detectedLang && languages.includes(detectedLang as SupportedLanguages)) {
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
