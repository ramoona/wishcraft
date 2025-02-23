import { getForeignWishlistByUsername } from "~/services/wishlist";
import { Layout } from "~/components/layout/Layout";
import { ForeignWishlist } from "~/components/wishlist/foreign/ForeignWishlist";
import { getSessionUser } from "~/services/auth";
import { WishlistError } from "~/services/wishlist/errors";
import { getErrorMessage } from "~/core/toastMessages";
import { UserError } from "~/services/user/errors";
import { ErrorAlert, UserNotFoundAlert } from "~/components/ui/alert";
import { getUserByUserName } from "~/services/user";
import { isErrorKnown, KnownError } from "~/core/errors";
import { redirect } from "next/navigation";

export default async function UserPage({ params }: { params: { username: string } }) {
  const sessionUser = await getSessionUser();

  if (sessionUser && sessionUser.username === params.username) {
    redirect(`/${params.username}/wishes`);
  }

  try {
    const wishlist = await getForeignWishlistByUsername(params.username);
    const wishlistOwner = await getUserByUserName(params.username);

    return (
      <Layout>
        <ForeignWishlist wishlist={wishlist} owner={wishlistOwner} />
      </Layout>
    );
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
}
