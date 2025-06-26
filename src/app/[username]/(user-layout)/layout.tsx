import { getSessionUser } from "~/services/session";
import { AuthenticatedLayout } from "~/components/layout/Layout";
import { ErrorMessage } from "~/components/ErrorMessage";
import { isErrorKnown, KnownError } from "~/core/errors";
import { countFriendRequestsForCurrentUser } from "~/services/friend";
import { redirect } from "next/navigation";

export default async function UserLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}>) {
  const { username } = await params;
  let sessionUser;
  try {
    sessionUser = await getSessionUser();
  } catch (e) {
    return <ErrorMessage errorCode={isErrorKnown(e as Error) ? (e as KnownError).errorCode : undefined} />;
  }

  if (!sessionUser || sessionUser.username !== username) {
    redirect("/");
  }

  if (sessionUser && !sessionUser.isOnboarded) {
    redirect(`/${sessionUser.username}/onboarding`);
  }

  const friendRequestsCount = await countFriendRequestsForCurrentUser();
  return (
    <AuthenticatedLayout user={sessionUser} friendRequestsCount={friendRequestsCount}>
      {children}
    </AuthenticatedLayout>
  );
}
