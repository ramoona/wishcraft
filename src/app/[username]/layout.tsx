import type { Metadata } from "next";
import { getSessionUser } from "~/services/session";
import { WishlistError } from "~/services/wishlist/errors";
import { UserError } from "~/services/user/errors";
import { ErrorMessage } from "~/components/ErrorMessage";
import { isErrorKnown, KnownError } from "~/core/errors";
import { getServerTranslations } from "~/lib/i18n/server/translations";

export default async function UserLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}>) {
  const { username } = await params;
  try {
    await getSessionUser();
    return children;
  } catch (e) {
    console.error("Error in UserLayout:", e);
    if (
      (e instanceof WishlistError && e.errorCode === "WISHLIST_NOT_FOUND") ||
      (e instanceof UserError && e.errorCode === "USER_NOT_FOUND")
    ) {
      return <ErrorMessage errorCode={e.errorCode} context={{ username }} />;
    }
    return <ErrorMessage errorCode={isErrorKnown(e as Error) ? (e as KnownError).errorCode : undefined} />;
  }
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
