import type { Metadata } from "next";
import "~/styles/globals.css";
import { getSessionUser } from "~/services/session";
import { AuthenticatedLayout, NonAuthenticatedLayout } from "~/components/layout/Layout";

export const metadata: Metadata = {
  title: "Wishcraft",
  description: "A place for all your wishes",
};

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionUser = await getSessionUser();
  return sessionUser ? (
    <AuthenticatedLayout user={sessionUser}>{children}</AuthenticatedLayout>
  ) : (
    <NonAuthenticatedLayout>{children}</NonAuthenticatedLayout>
  );
}
