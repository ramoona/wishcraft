import type { Metadata } from "next";
import { getServerTranslations } from "~/lib/i18n/server/translations";

export default function FriendLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

export async function generateMetadata({ params }: { params: Promise<{ friend: string }> }): Promise<Metadata> {
  const { friend } = await params;
  const { t } = await getServerTranslations();

  return {
    title: t("metadata.username.title", { username: friend }),
    description: t("metadata.username.description", { username: friend }),
    openGraph: {
      title: t("metadata.username.title", { username: friend }),
      description: t("metadata.username.description", { username: friend }),
      url: `https://mywishcraft.app/${friend}`,
      siteName: "Wishcraft",
    },
  };
}
