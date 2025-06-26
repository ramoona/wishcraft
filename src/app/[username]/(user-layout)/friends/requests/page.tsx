import { getSessionUser } from "~/services/session";
import { ErrorMessage } from "~/components/ErrorMessage";
import { isErrorKnown, KnownError } from "~/core/errors";
import { redirect } from "next/navigation";
import { getFriendRequestsForCurrentUser } from "~/services/friend";
import { FriendsRequestsList } from "~/components/friends/FriendRequestsList";

export default async function FriendsPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/");
  }

  if (sessionUser && !sessionUser.isOnboarded) {
    redirect(`/${sessionUser.username}/onboarding`);
  }

  try {
    const friendRequests = await getFriendRequestsForCurrentUser();
    return <FriendsRequestsList friendRequests={friendRequests} user={sessionUser} />;
  } catch (e) {
    return <ErrorMessage errorCode={isErrorKnown(e as Error) ? (e as KnownError).errorCode : undefined} />;
  }
}
