import { getServerSession } from "~/auth/getServerSession";
import { getWishlistByUserId } from "prisma/handlers/wishlist";
import { getUserWithRelationsByUsername } from "prisma/handlers/user";
import { Layout } from "~/components/layout/Layout";

export default async function UserPage({ params }: { params: { username: string } }) {
  const session = await getServerSession();
  const sessionUser = session?.user;

  if (sessionUser && sessionUser.username === params.username) {
    const wishlist = await getWishlistByUserId(session.user.id);
    return (
      <Layout>
        <div>Hi, {session.user.name}!</div>
        <div>Here is your wishlist:</div>
        <ul>
          {wishlist.wishes.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </Layout>
    );
  }

  const userWithWishlist = await getUserWithRelationsByUsername(params.username);
  return <Layout>Wishlist of {userWithWishlist.name}</Layout>;
}
