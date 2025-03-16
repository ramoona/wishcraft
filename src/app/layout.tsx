import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { Toaster } from "~/components/ui/toasts";
import { Analytics } from "@vercel/analytics/react";
import { cn } from "~/utils/classnames";
import { LanguageProvider } from "~/components/LanguageProvider";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata: Metadata = {
  title: "Wishcraft",
  description: "A place for all your wishes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={cn(inter.className, "relative bg-background")}>
        <LanguageProvider>
          {children}
          <Toaster position="top-right" richColors />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
