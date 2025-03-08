"use client";

import { useTranslation as useI18nTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export function useTranslation(namespace = "common") {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const translation = useI18nTranslation(namespace);

  // If we're not on the client yet, provide a dummy translation function
  // that just returns the key to prevent hydration errors
  if (!isClient) {
    return {
      ...translation,
      t: (key: string) => key,
    };
  }

  return translation;
}
