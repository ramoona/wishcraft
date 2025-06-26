import { getForeignWishlistByUsername } from "~/services/wishlist";
import { getSessionUser } from "~/services/session";
import { WishlistError } from "~/services/wishlist/errors";
import { UserError } from "~/services/user/errors";
import { ErrorMessage } from "~/components/ErrorMessage";
import { getUserByUserName } from "~/services/user";
import { isErrorKnown, KnownError } from "~/core/errors";
import { redirect } from "next/navigation";
import { ForeignUser } from "~/components/user/ForeignUser";
import { NonAuthenticatedLayout, AuthenticatedLayout } from "~/components/layout/Layout";
import { countFriendRequestsForCurrentUser } from "~/services/friend";

export default async function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const sessionUser = await getSessionUser();
  const { username } = await params;
  let wishlistOwner;
  let wishlist;

  if (sessionUser && sessionUser.username === username) {
    redirect(`/${username}/wishes`);
  }

  try {
    wishlistOwner = await getUserByUserName(username);
    wishlist = await getForeignWishlistByUsername(username);
  } catch (e) {
    if (
      (e instanceof WishlistError && e.errorCode === "WISHLIST_NOT_FOUND") ||
      (e instanceof UserError && e.errorCode === "USER_NOT_FOUND")
    ) {
      return <ErrorMessage errorCode={e.errorCode} context={{ username }} />;
    }
    return <ErrorMessage errorCode={isErrorKnown(e as Error) ? (e as KnownError).errorCode : undefined} />;
  }

  if (sessionUser) {
    if (wishlistOwner.isFriend) {
      redirect(`/${sessionUser.username}/friends/your-friends/${wishlistOwner.username}`);
    } else {
      const friendRequestsCount = await countFriendRequestsForCurrentUser();
      return (
        <AuthenticatedLayout user={sessionUser} friendRequestsCount={friendRequestsCount}>
          <ForeignUser wishlist={wishlist} wishlistOwner={wishlistOwner} currentUser={sessionUser} />
        </AuthenticatedLayout>
      );
    }
  }

  return (
    <NonAuthenticatedLayout>
      <ForeignUser wishlist={wishlist} wishlistOwner={wishlistOwner} currentUser={sessionUser} />
    </NonAuthenticatedLayout>
  );
}
