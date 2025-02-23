import { getWishlistByUserId } from "~/services/wishlist";
import { Layout } from "~/components/layout/Layout";
import { OwnWishlist } from "~/components/wishlist/own/OwnWishlist";
import { getSessionUser } from "~/services/auth";
import { WishlistError } from "~/services/wishlist/errors";
import { getErrorMessage } from "~/core/toastMessages";
import { ErrorAlert, SomethingWentWrongAlert } from "~/components/ui/alert";
import { isErrorKnown, KnownError } from "~/core/errors";
import { redirect } from "next/navigation";

export default async function WishesPage({ params }: { params: { username: string } }) {
  const sessionUser = await getSessionUser();

  if (sessionUser && sessionUser.username === params.username) {
    try {
      const wishlist = await getWishlistByUserId(sessionUser.id);
      return (
        <Layout>
          <OwnWishlist data={wishlist} />
        </Layout>
      );
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
  }

  redirect(`/${params.username}`);
}
