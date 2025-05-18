import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { Toaster } from "~/components/ui/toasts";
import { Analytics } from "@vercel/analytics/react";
import { cn } from "~/utils/classnames";
import type { Metadata, Viewport } from "next";
import { Providers } from "~/app/providers";
import { detectLanguage } from "~/lib/i18n/detect-language";
import { Shapes } from "~/app/shapes";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata: Metadata = {
  title: "Wishcraft",
  description: "A place for all your wishes",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await detectLanguage();

  return (
    <html lang={language}>
      <body className={cn(inter.className, "relative bg-background")}>
        <Shapes />
        <Providers language={language}>
          <Toaster position="top-right" />
          <Analytics />
        </Providers>
        {/*<svg viewBox="0 0 202 202" width="300">*/}
        {/*  <use xlinkHref="#shape-1" fill="red"></use>*/}
        {/*</svg>*/}
        {children}
      </body>
    </html>
  );
}
