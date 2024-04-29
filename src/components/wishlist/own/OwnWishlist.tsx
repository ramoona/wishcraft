import { WishlistT } from "~/types/wishlist";
import { AddNewWish } from "~/components/wishlist/own/AddNewWish";
import { StatusBadge } from "~/components/wishlist/StatusBadge";
import { WishItem } from "~/components/wishlist/WishItem";
import { WishItemList } from "~/components/wishlist/WishItemList";

export function OwnWishlist({ data }: { data: WishlistT }) {
  if (!data.wishes.length) {
    return <div>No data</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <AddNewWish />
      <WishItemList>
        {data.wishes.map(wish => (
          <div key={wish.id} className="flex items-center gap-2">
            <WishItem data={wish} />
            <StatusBadge status={wish.status} />
          </div>
        ))}
      </WishItemList>
    </div>
  );
}
