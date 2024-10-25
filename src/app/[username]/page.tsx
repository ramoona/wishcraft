import { getWishlistByUserId } from "~/services/wishlist";
import { getUserWithRelationsByUsername } from "~/services/user";
import { Layout } from "~/components/layout/Layout";
import { OwnWishlist } from "~/components/wishlist/own/OwnWishlist";
import { ForeignWishlist } from "~/components/wishlist/foreign/ForeignWishlist";
import { getSessionUser } from "~/services/auth";
import { WishlistError } from "~/services/wishlist/errors";
import { getErrorMessage } from "~/core/toastMessages";
import { ServerError } from "~/services/errors";

export default async function UserPage({ params }: { params: { username: string } }) {
  const sessionUser = await getSessionUser();

  let wishlist;
  if (sessionUser && sessionUser.username === params.username) {
    try {
      wishlist = await getWishlistByUserId(sessionUser.id);
    } catch (e) {
      if (e instanceof WishlistError || e instanceof ServerError) {
        return <div>{getErrorMessage(e.errorCode)}</div>;
      }
      return <div>{getErrorMessage("UNKNOWN")}</div>;
    }

    return (
      <Layout>
        <OwnWishlist data={wishlist} />
      </Layout>
    );
  }

  let userWithWishlist;

  try {
    userWithWishlist = await getUserWithRelationsByUsername(params.username);
  } catch (e) {
    if (e instanceof WishlistError || e instanceof ServerError) {
      return <div>{getErrorMessage(e.errorCode)}</div>;
    }
    return <div>{getErrorMessage("UNKNOWN")}</div>;
  }

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-light">
        <span className="font-medium">{`@${userWithWishlist.username}'s`}</span> wishlist:
      </h1>
      <ForeignWishlist data={userWithWishlist.wishlist} />
    </Layout>
  );
}
