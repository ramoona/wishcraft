"use client";

import { SupportedLanguages } from "~/lib/i18n/settings";
import { Select } from "~/components/ui/select";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export function TermsOfServiceLanguageSwitcher({ lang }: { lang: SupportedLanguages }) {
  const router = useRouter();
  const { t } = useTranslation();

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "ru", label: "Русский" },
    { value: "de", label: "Deutsch" },
  ];

  return (
    <Select
      value={lang}
      onChange={lang => router.push(`/terms-of-service/${lang}`)}
      options={languageOptions}
      placeholder={t("placeholders.selectLanguage")}
      contentWidth
    />
  );
}
