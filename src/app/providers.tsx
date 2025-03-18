"use client";

import React from "react";
import { I18nProvider } from "~/lib/i18n/i18n-provider";

export function Providers({ children, language }: React.PropsWithChildren<{ language: string }>) {
  return <I18nProvider language={language}>{children}</I18nProvider>;
}
