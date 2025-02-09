import { getForeignWishlistByUsername, getWishlistByUserId } from "~/services/wishlist";
import { Layout } from "~/components/layout/Layout";
import { OwnWishlist } from "~/components/wishlist/own/OwnWishlist";
import { ForeignWishlist } from "~/components/wishlist/foreign/ForeignWishlist";
import { getSessionUser } from "~/services/auth";
import { WishlistError } from "~/services/wishlist/errors";
import { getErrorMessage } from "~/core/toastMessages";
import { UserError } from "~/services/user/errors";
import { ErrorAlert, SomethingWentWrongAlert, UserNotFoundAlert } from "~/components/ui/alert";
import { getUserByUserName } from "~/services/user";
import { isErrorKnown, KnownError } from "~/core/errors";

export default async function UserPage({ params }: { params: { username: string } }) {
  const sessionUser = await getSessionUser();

  let wishlist;

  if (sessionUser && sessionUser.username === params.username) {
    try {
      wishlist = await getWishlistByUserId(sessionUser.id);
    } catch (e) {
      if (e instanceof WishlistError && e.errorCode === "WISHLIST_NOT_FOUND") {
        return <SomethingWentWrongAlert />;
      }
      return (
        <Layout>
          <ErrorAlert>{getErrorMessage(isErrorKnown(e as Error) ? (e as KnownError).errorCode : "UNKNOWN")}</ErrorAlert>
        </Layout>
      );
    }

    return (
      <Layout>
        <OwnWishlist data={wishlist} />
      </Layout>
    );
  }

  let wishlistOwner;

  try {
    wishlist = await getForeignWishlistByUsername(params.username);
    wishlistOwner = await getUserByUserName(params.username);
  } catch (e) {
    if (
      (e instanceof WishlistError && e.errorCode === "WISHLIST_NOT_FOUND") ||
      (e instanceof UserError && e.errorCode === "USER_NOT_FOUND")
    ) {
      return <UserNotFoundAlert username={params.username} />;
    }
    return (
      <Layout>
        <ErrorAlert>{getErrorMessage(isErrorKnown(e as Error) ? (e as KnownError).errorCode : "UNKNOWN")}</ErrorAlert>
      </Layout>
    );
  }

  return (
    <Layout>
      <ForeignWishlist data={wishlist} name={wishlistOwner.firstName || wishlistOwner.username || "Unknown user"} />
    </Layout>
  );
}
