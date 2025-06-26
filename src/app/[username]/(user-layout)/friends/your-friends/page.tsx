import { getSessionUser } from "~/services/session";
import { ErrorMessage } from "~/components/ErrorMessage";
import { isErrorKnown, KnownError } from "~/core/errors";
import { redirect } from "next/navigation";
import { getFriendRequestsForCurrentUser, getFriendsForCurrentUser } from "~/services/friend";
import { FriendsList } from "~/components/friends/FriendsList";

export default async function FriendsPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/");
  }

  if (sessionUser && !sessionUser.isOnboarded) {
    redirect(`/${sessionUser.username}/onboarding`);
  }

  try {
    const friends = await getFriendsForCurrentUser();
    const friendRequests = await getFriendRequestsForCurrentUser();
    return <FriendsList friends={friends} user={sessionUser} friendRequests={friendRequests} />;
  } catch (e) {
    return <ErrorMessage errorCode={isErrorKnown(e as Error) ? (e as KnownError).errorCode : undefined} />;
  }
}
