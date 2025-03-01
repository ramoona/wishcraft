import { getWishesReservedByCurrentUser, getWishlistByUserId } from "~/services/wishlist";
import { OwnWishlist } from "~/components/wishlist/own/OwnWishlist";
import { getSessionUser } from "~/services/session";
import { WishlistError } from "~/services/wishlist/errors";
import { getErrorMessage } from "~/core/toastMessages";
import { ErrorAlert, SomethingWentWrongAlert } from "~/components/ui/alert";
import { isErrorKnown, KnownError } from "~/core/errors";
import { redirect } from "next/navigation";

export default async function WishesPage({ params }: { params: Promise<{ username: string }> }) {
  const sessionUser = await getSessionUser();
  const { username } = await params;

  if (sessionUser && sessionUser.username === username) {
    try {
      const wishlist = await getWishlistByUserId(sessionUser.id);
      const reserved = await getWishesReservedByCurrentUser();
      return <OwnWishlist data={wishlist} reserved={reserved} showOwnReserved={sessionUser.showReserved ?? false} />;
    } catch (e) {
      if (e instanceof WishlistError && e.errorCode === "WISHLIST_NOT_FOUND") {
        return <SomethingWentWrongAlert />;
      }
      return (
        <ErrorAlert>{getErrorMessage(isErrorKnown(e as Error) ? (e as KnownError).errorCode : "UNKNOWN")}</ErrorAlert>
      );
    }
  }

  redirect(`/${username}`);
}
