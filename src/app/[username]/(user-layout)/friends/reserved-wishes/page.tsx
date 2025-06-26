import { getSessionUser } from "~/services/session";
import { ErrorMessage } from "~/components/ErrorMessage";
import { isErrorKnown, KnownError } from "~/core/errors";
import { redirect } from "next/navigation";
import { getWishesReservedByCurrentUser } from "~/services/wishlist";
import { ReservedWishesList } from "~/components/friends/ReservedWishes";
import { getFriendRequestsForCurrentUser } from "~/services/friend";

export default async function FriendsPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/");
  }

  if (sessionUser && !sessionUser.isOnboarded) {
    redirect(`/${sessionUser.username}/onboarding`);
  }

  try {
    const reservedWishes = await getWishesReservedByCurrentUser();
    const friendRequests = await getFriendRequestsForCurrentUser();
    return <ReservedWishesList reservedWishes={reservedWishes} user={sessionUser} friendRequests={friendRequests} />;
  } catch (e) {
    return <ErrorMessage errorCode={isErrorKnown(e as Error) ? (e as KnownError).errorCode : undefined} />;
  }
}
