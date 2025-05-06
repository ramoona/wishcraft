"use client";

import { useTranslation } from "react-i18next";
import { Select } from "~/components/ui/select";
import { useEffect, useState } from "react";

export function LanguageSwitcher({ contentWidth }: { contentWidth?: boolean }) {
  const { i18n } = useTranslation();
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
    { value: "en", label: "English" },
    { value: "ru", label: "Русский" },
  ];

  // Don't render anything until the component has mounted on the client
  if (!isMounted) {
    return null;
  }

  return <Select value={currentLang} onChange={changeLanguage} options={languageOptions} contentWidth={contentWidth} />;
}
