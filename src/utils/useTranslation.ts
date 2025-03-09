"use client";

import { useTranslation as useI18nTranslation, UseTranslationResponse } from "react-i18next";
import { useEffect, useState } from "react";

export function useTranslation(): UseTranslationResponse<"common", undefined> {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const tFunction = useI18nTranslation("common");

  // If we're not on the client yet, provide a dummy translation function
  // that just returns the key to prevent hydration errors
  if (!isClient) {
    return {
      ...tFunction,
      // @ts-expect-error stub translation function
      t: (key: string) => key,
    };
  }

  return tFunction;
}
