import type { Metadata } from "next";
import { getSessionUser } from "~/services/session";
import { AuthenticatedLayout, NonAuthenticatedLayout } from "~/components/layout/Layout";
import { getUserByUserName } from "~/services/user";
import { WishlistError } from "~/services/wishlist/errors";
import { UserError } from "~/services/user/errors";
import { ErrorMessage } from "~/components/ErrorMessage";
import { isErrorKnown, KnownError } from "~/core/errors";

export const metadata: Metadata = {
  title: "Wishcraft",
  description: "A place for all your wishes",
};

export default async function UserLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}>) {
  const { username } = await params;
  try {
    const sessionUser = await getSessionUser();
    const userByUsername = await getUserByUserName(username);

    return sessionUser ? (
      <AuthenticatedLayout
        user={sessionUser}
        otherUser={userByUsername.id !== sessionUser.id ? userByUsername : undefined}
      >
        {children}
      </AuthenticatedLayout>
    ) : (
      <NonAuthenticatedLayout>{children}</NonAuthenticatedLayout>
    );
  } catch (e) {
    if (
      (e instanceof WishlistError && e.errorCode === "WISHLIST_NOT_FOUND") ||
      (e instanceof UserError && e.errorCode === "USER_NOT_FOUND")
    ) {
      return <ErrorMessage errorCode={e.errorCode} context={{ username }} />;
    }
    return <ErrorMessage errorCode={isErrorKnown(e as Error) ? (e as KnownError).errorCode : undefined} />;
  }
}
