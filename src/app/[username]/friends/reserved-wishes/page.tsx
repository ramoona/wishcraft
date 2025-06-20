import { getSessionUser } from "~/services/session";
import { ErrorMessage } from "~/components/ErrorMessage";
import { isErrorKnown, KnownError } from "~/core/errors";
import { redirect } from "next/navigation";
import { getWishesReservedByCurrentUser } from "~/services/wishlist";
import { ReservedWishesList } from "~/components/friends/ReservedWishes";

export default async function FriendsPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/");
  }

  try {
    const reservedWishes = await getWishesReservedByCurrentUser();
    return <ReservedWishesList reservedWishes={reservedWishes} user={sessionUser} />;
  } catch (e) {
    return <ErrorMessage errorCode={isErrorKnown(e as Error) ? (e as KnownError).errorCode : undefined} />;
  }
}
