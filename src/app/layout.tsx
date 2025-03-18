import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { Toaster } from "~/components/ui/toasts";
import { Analytics } from "@vercel/analytics/react";
import { cn } from "~/utils/classnames";
import Head from "next/head";
import { Providers } from "~/app/providers";
import { detectLanguage } from "~/lib/i18n/detect-language";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata: Metadata = {
  title: "Wishcraft",
  description: "A place for all your wishes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await detectLanguage();

  return (
    <html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <body className={cn(inter.className, "relative bg-background")}>
        <Providers language={language}>
          <Toaster position="top-right" richColors />
          <Analytics />
        </Providers>
        {children}
      </body>
    </html>
  );
}
