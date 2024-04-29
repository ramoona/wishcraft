import { WishlistT } from "~/types/wishlist";
import { ForeignWish } from "~/components/wishlist/foreign/ForeignWish";

export function ForeignWishlist({ data }: { data: WishlistT }) {
  if (!data.wishes.length) {
    return <div>No data</div>;
  }
  return (
    <div className="grid grid-cols-5 items-center gap-2">
      {data.wishes.map(wish => (
        <ForeignWish data={wish} key={wish.id} />
      ))}
    </div>
  );
}
