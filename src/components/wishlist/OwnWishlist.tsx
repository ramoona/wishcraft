import { WishlistT } from "~/types/wishlist";
import { WishForm } from "~/components/wishlist/WishForm";
import { AddNewWish } from "~/components/wishlist/AddNewWish";

export function OwnWishlist({ data }: { data: WishlistT }) {
  if (!data.wishes.length) {
    return <div>No data</div>;
  }

  return (
    <div>
      <AddNewWish />
      {data.wishes.map(wish => (
        <div key={wish.id}>
          <WishForm data={wish} />
          <div className="p-2">{wish.status || "—"}</div>
        </div>
      ))}
    </div>
  );
}
