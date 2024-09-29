import { WishlistT, WishT } from "~/types/wishlist";
import { ForeignWish } from "~/components/wishlist/foreign/ForeignWish";
import { WishItemList } from "~/components/wishlist/WishItemList";
import { groupBy } from "ramda";
import { WishStatus } from "@prisma/client";

export function ForeignWishlist({ data }: { data: WishlistT }) {
  if (!data.wishes.length) {
    return <div>Nothing here yet</div>;
  }

  const { active = [], fulfilled = [] } = groupBy<WishT>(wish => {
    if (wish.status === WishStatus.FULFILLED) {
      return "fulfilled";
    }

    return "active";
  })(data.wishes);

  return (
    <div className="flex flex-col gap-4">
      <WishItemList>
        {active.map(wish => (
          <ForeignWish data={wish} key={wish.id} />
        ))}
      </WishItemList>
      {fulfilled.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg">
            <span>Fulfilled wishes</span>
          </h2>
          <WishItemList>
            {fulfilled.map(wish => (
              <ForeignWish data={wish} key={wish.id} />
            ))}
          </WishItemList>
        </div>
      )}
    </div>
  );
}
