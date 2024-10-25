import { WishlistT, WishT } from "~/services/wishlist/types";
import { StatusBadge } from "~/components/wishlist/StatusBadge";
import { WishItem } from "~/components/wishlist/WishItem";
import { WishItemList } from "~/components/wishlist/WishItemList";
import { WishDropdownMenu } from "~/components/wishlist/own/WishDropdownMenu";
import { groupBy } from "ramda";
import { WishStatus } from "@prisma/client";
import { Eye, EyeClosed } from "@phosphor-icons/react/dist/ssr";
import { AddNewWish } from "~/components/wishlist/own/AddNewWish";

export function OwnWishlist({ data }: { data: WishlistT }) {
  if (!data.wishes.length) {
    return (
      <>
        <div className="flex min-h-[calc(100vh_-_4rem)] flex-col gap-4 pt-8 text-center">
          <span>There are no wishes in this wishlist yet...</span>
        </div>
        <AddNewWish />
      </>
    );
  }

  const {
    active = [],
    fulfilled = [],
    archived = [],
  } = groupBy<WishT>(wish => {
    if (wish.status === "ARCHIVED") {
      return "archived";
    }

    if (wish.status === WishStatus.FULFILLED) {
      return "fulfilled";
    }

    return "active";
  })(data.wishes);

  return (
    <div className="relative">
      <div className="flex min-h-[calc(100vh_-_4rem)] flex-col gap-6 pt-8">
        <WishItemList>
          {active.map(wish => (
            <div key={wish.id} className="flex items-start gap-2">
              <WishItem data={wish} />
              <StatusBadge status={wish.status} />
              <WishDropdownMenu wish={wish} />
            </div>
          ))}
        </WishItemList>
        {fulfilled.length > 0 && (
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg">
              <span className="font-medium">Fulfilled wishes</span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                everyone can see that
                <Eye className="size-[14px]" />
              </span>
            </h2>
            <WishItemList>
              {fulfilled.map(wish => (
                <div key={wish.id} className="flex items-start gap-2">
                  <WishItem data={wish} />
                  <StatusBadge status={wish.status} />
                  <WishDropdownMenu wish={wish} />
                </div>
              ))}
            </WishItemList>
          </div>
        )}
        {archived.length > 0 && (
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg">
              <span className="font-medium">Archived</span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                only you can see that
                <EyeClosed className="size-[14px]" />
              </span>
            </h2>
            <WishItemList>
              {archived.map(wish => (
                <div key={wish.id} className="flex items-start gap-2">
                  <WishItem data={wish} />
                  <StatusBadge status={wish.status} />
                  <WishDropdownMenu wish={wish} />
                </div>
              ))}
            </WishItemList>
          </div>
        )}
      </div>
      <AddNewWish />
    </div>
  );
}
