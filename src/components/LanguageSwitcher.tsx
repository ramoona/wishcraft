"use client";

import { useTranslation } from "~/utils/useTranslation";
import { Select } from "~/components/ui/select";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState("en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);

    // Update the current language state when i18n is initialized
    setCurrentLang(i18n.language);

    // Listen for language changes
    const handleLanguageChanged = (lng: string) => {
      setCurrentLang(lng);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => i18n.off("languageChanged", handleLanguageChanged);
  }, [i18n]);

  const changeLanguage = (language: string) => i18n.changeLanguage(language);

  const languageOptions = [
    { value: "en", label: "☕ English" },
    { value: "ru", label: "🪆 Русский" },
  ];

  // Don't render anything until the component has mounted on the client
  if (!isMounted) {
    return null;
  }

  return <Select value={currentLang} onChange={changeLanguage} options={languageOptions} placeholder={t("language")} />;
}
