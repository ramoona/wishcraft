import type { Metadata } from "next";
import "~/styles/globals.css";
import { getSessionUser } from "~/services/session";
import { AuthenticatedLayout, NonAuthenticatedLayout } from "~/components/layout/Layout";
import { getUserByUserName } from "~/services/user";

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
}
