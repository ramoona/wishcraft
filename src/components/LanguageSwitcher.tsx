"use client";

import { useTranslation } from "react-i18next";
import { Select } from "~/components/ui/select";
import { useEffect, useState } from "react";
import { SupportedLanguages } from "~/lib/i18n/settings";

export function LanguageSwitcher({
  contentWidth,
  filled,
  onChange,
}: {
  contentWidth?: boolean;
  filled?: boolean;
  onChange?: (lang: SupportedLanguages) => void;
}) {
  const { i18n, t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [i18n]);

  const changeLanguage = async (language: string) => {
    await i18n.changeLanguage(language);
    onChange?.(language as SupportedLanguages);
  };

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "ru", label: "Русский" },
    { value: "de", label: "Deutsch" },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <Select
      value={i18n.language}
      onChange={changeLanguage}
      options={languageOptions}
      contentWidth={contentWidth}
      placeholder={t("placeholders.selectLanguage")}
      filled={filled}
    />
  );
}
