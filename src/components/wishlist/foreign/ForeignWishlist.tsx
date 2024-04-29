import { WishlistT } from "~/types/wishlist";
import { ForeignWish } from "~/components/wishlist/foreign/ForeignWish";
import { WishItemList } from "~/components/wishlist/WishItemList";

export function ForeignWishlist({ data }: { data: WishlistT }) {
  if (!data.wishes.length) {
    return <div>No data</div>;
  }
  return (
    <WishItemList>
      {data.wishes.map(wish => (
        <ForeignWish data={wish} key={wish.id} />
      ))}
    </WishItemList>
  );
}
