import { getWishlistByUserId } from "prisma/handlers/wishlist";
import { getUserWithRelationsByUsername } from "prisma/handlers/user";
import { Layout } from "~/components/layout/Layout";
import { OwnWishlist } from "~/components/wishlist/own/OwnWishlist";
import { ForeignWishlist } from "~/components/wishlist/foreign/ForeignWishlist";
import { AddNewWish } from "~/components/wishlist/own/AddNewWish";
import { getSessionUser } from "~/auth/getSessionUser";

export default async function UserPage({ params }: { params: { username: string } }) {
  const sessionUser = await getSessionUser();

  let wishlist;
  if (sessionUser && sessionUser.username === params.username) {
    try {
      wishlist = await getWishlistByUserId(sessionUser.id);
    } catch {
      return <div>Wishlist is not found :(</div>;
    }

    return (
      <Layout>
        <h1 className="flex items-center gap-4 text-2xl font-light">
          <span>
            Hey, <span className="font-medium">{sessionUser.username}</span> 👋🏻
          </span>
          <AddNewWish />
        </h1>
        <OwnWishlist data={wishlist} />
      </Layout>
    );
  }

  let userWithWishlist;

  try {
    userWithWishlist = await getUserWithRelationsByUsername(params.username);
  } catch {
    return <div>User not found :(</div>;
  }

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-light">
        The stuff <span className="font-medium">{userWithWishlist.username}</span> wants
      </h1>
      <ForeignWishlist data={userWithWishlist.wishlist} />
    </Layout>
  );
}
