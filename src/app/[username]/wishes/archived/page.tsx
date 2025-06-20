import { getWishlistByUserId } from "~/services/wishlist";
import { getSessionUser } from "~/services/session";
import { ErrorMessage } from "~/components/ErrorMessage";
import { isErrorKnown, KnownError } from "~/core/errors";
import { redirect } from "next/navigation";
import { WishStatus } from "@prisma/client";
import { OwnWishes } from "~/components/wishlist/own/OwnWishes";

export default async function ArchivedWishesPage({ params }: { params: Promise<{ username: string }> }) {
  const sessionUser = await getSessionUser();
  const { username } = await params;

  if (sessionUser && sessionUser.username === username) {
    try {
      const wishlist = await getWishlistByUserId(sessionUser.id);
      const activeWishes = wishlist.wishes.filter(wish => wish.status === WishStatus.ARCHIVED);

      return <OwnWishes wishes={activeWishes} showOwnReserved={sessionUser.showReserved ?? false} status="ARCHIVED" />;
    } catch (e) {
      return <ErrorMessage errorCode={isErrorKnown(e as Error) ? (e as KnownError).errorCode : undefined} />;
    }
  }

  redirect(`/${username}`);
}
