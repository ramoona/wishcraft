import { getSessionUser } from "~/services/session";
import { ErrorMessage } from "~/components/ErrorMessage";
import { isErrorKnown, KnownError } from "~/core/errors";
import { redirect } from "next/navigation";
import { getFriendsForCurrentUser } from "~/services/friend";
import { FriendsPageContent } from "~/components/friends/FriendsPageContent";
import { getWishesReservedByCurrentUser } from "~/services/wishlist";

export default async function FriendsPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/");
  }

  try {
    const friends = await getFriendsForCurrentUser();
    const reservedWishes = await getWishesReservedByCurrentUser();
    return <FriendsPageContent friends={friends} reservedWishes={reservedWishes} />;
  } catch (e) {
    return <ErrorMessage errorCode={isErrorKnown(e as Error) ? (e as KnownError).errorCode : undefined} />;
  }
}
