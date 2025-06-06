import { getWishlistByUserId } from "~/services/wishlist";
import { OwnWishlist } from "~/components/wishlist/own/OwnWishlist";
import { getSessionUser } from "~/services/session";
import { ErrorMessage } from "~/components/ErrorMessage";
import { isErrorKnown, KnownError } from "~/core/errors";
import { redirect } from "next/navigation";

export default async function WishesPage({ params }: { params: Promise<{ username: string }> }) {
  const sessionUser = await getSessionUser();
  const { username } = await params;

  if (sessionUser && sessionUser.username === username) {
    try {
      const wishlist = await getWishlistByUserId(sessionUser.id);
      return <OwnWishlist data={wishlist} showOwnReserved={sessionUser.showReserved ?? false} />;
    } catch (e) {
      return <ErrorMessage errorCode={isErrorKnown(e as Error) ? (e as KnownError).errorCode : undefined} />;
    }
  }

  redirect(`/${username}`);
}
