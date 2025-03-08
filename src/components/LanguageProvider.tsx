"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "~/lib/i18n";

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);

    // Initialize i18n on the client side
    if (!i18n.isInitialized) {
      void i18n.init();
    }

    // i18next will automatically handle cookie persistence
    // No need for manual cookie management
  }, []);

  // Only render on client-side to prevent hydration issues
  if (!isClient) {
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
