import { getForeignWishlistByUsername } from "~/services/wishlist";
import { ForeignWishlist } from "~/components/wishlist/foreign/ForeignWishlist";
import { getSessionUser } from "~/services/session";
import { WishlistError } from "~/services/wishlist/errors";
import { UserError } from "~/services/user/errors";
import { ErrorMessage } from "~/components/ErrorMessage";
import { getUserByUserName } from "~/services/user";
import { isErrorKnown, KnownError } from "~/core/errors";
import { redirect } from "next/navigation";

export default async function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const sessionUser = await getSessionUser();
  const { username } = await params;

  if (sessionUser && sessionUser.username === username) {
    redirect(`/${username}/wishes`);
  }

  try {
    const wishlistOwner = await getUserByUserName(username);
    const wishlist = await getForeignWishlistByUsername(username);

    if (wishlistOwner.isProfileHidden) {
      return <div>{username} preferred to hide their wishes 🙈</div>;
    }

    return <ForeignWishlist wishlist={wishlist} owner={wishlistOwner} />;
  } catch (e) {
    if (
      (e instanceof WishlistError && e.errorCode === "WISHLIST_NOT_FOUND") ||
      (e instanceof UserError && e.errorCode === "USER_NOT_FOUND")
    ) {
      return <ErrorMessage errorCode={e.errorCode} context={{ username }} />;
    }
    return <ErrorMessage errorCode={isErrorKnown(e as Error) ? (e as KnownError).errorCode : undefined} />;
  }
}
