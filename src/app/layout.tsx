import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { Toaster } from "~/components/ui/toasts";
import { Analytics } from "@vercel/analytics/react";
import { cn } from "~/utils/classnames";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={cn(inter.className, "bg-secondary-background relative")}>{children}</body>
      <Toaster position="top-right" richColors />
      <Analytics />
    </html>
  );
}
