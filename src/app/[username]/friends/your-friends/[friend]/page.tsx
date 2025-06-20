import { getSessionUser } from "~/services/session";
import { redirect } from "next/navigation";
import { ForeignUser } from "~/components/user/ForeignUser";
import { getUserByUserName } from "~/services/user";
import { getForeignWishlistByUsername } from "~/services/wishlist";

export default async function FriendsPage({ params }: { params: Promise<{ friend: string }> }) {
  const sessionUser = await getSessionUser();
  const { friend } = await params;

  if (!friend) {
    redirect("/");
  }

  if (!sessionUser) {
    redirect(`/${friend}`);
  }

  const friendUser = await getUserByUserName(friend);
  const wishlist = await getForeignWishlistByUsername(friend);

  return <ForeignUser wishlistOwner={friendUser} wishlist={wishlist} currentUser={sessionUser} />;
}
