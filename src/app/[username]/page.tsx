import { getServerSession } from "~/auth/getServerSession";
import { getWishlistByUserId } from "prisma/handlers/wishlist";
import { getUserWithRelationsByUsername } from "prisma/handlers/user";
import { Layout } from "~/components/layout/Layout";
import { OwnWishlist } from "~/components/wishlist/OwnWishlist";
import { ForeignWishlist } from "~/components/wishlist/foreign/ForeignWishlist";

export default async function UserPage({ params }: { params: { username: string } }) {
  const session = await getServerSession();
  const sessionUser = session?.user;

  if (sessionUser && sessionUser.username === params.username) {
    const wishlist = await getWishlistByUserId(sessionUser.id);
    return (
      <Layout>
        <h1>Hi, {sessionUser.username}!</h1>
        <OwnWishlist data={wishlist} />
      </Layout>
    );
  }

  const userWithWishlist = await getUserWithRelationsByUsername(params.username);
  return (
    <Layout>
      <h1>Wishlist of {userWithWishlist.username}</h1>
      <ForeignWishlist data={userWithWishlist.wishlist} />
    </Layout>
  );
}
