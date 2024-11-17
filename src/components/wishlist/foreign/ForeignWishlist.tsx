import { WishlistType } from "~/services/wishlist/types";
import { ForeignWish } from "~/components/wishlist/foreign/ForeignWish";
import { WishItemList } from "~/components/wishlist/WishItemList";

export function ForeignWishlist({ data, name }: { data: WishlistType; name: string }) {
  if (!data.wishes.length) {
    return <div>Nothing here yet</div>;
  }

  const activeWishes = data.wishes.filter(({ status }) => status === "ACTIVE" || status === "RESERVED");

  return (
    <div className="flex min-h-[calc(100vh_-_4rem)] w-full flex-col gap-4 py-8">
      <h1 className="mb-4 text-2xl font-light">
        <span className="font-medium">{`${name}'s`}</span> Wishlist
      </h1>
      <p>
        You can <b>anonymously</b> reserve some of the wishes
      </p>
      <WishItemList>
        {activeWishes.map(wish => (
          <ForeignWish data={wish} key={wish.id} isMobile={true} />
        ))}
      </WishItemList>
    </div>
  );
}
