import type { Metadata } from "next";

import { getServerTranslations } from "~/lib/i18n/server/translations";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const { t } = await getServerTranslations();

  return {
    title: t("metadata.username.title", { username }),
    description: t("metadata.username.description", { username }),
    openGraph: {
      title: t("metadata.username.title", { username }),
      description: t("metadata.username.description", { username }),
      url: `https://mywishcraft.app/${username}`,
      siteName: "Wishcraft",
    },
  };
}
