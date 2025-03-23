import { WishlistType } from "~/services/wishlist/types";
import { ForeignWish } from "~/components/wishlist/foreign/ForeignWish";
import { WishlistItem } from "~/components/wishlist/WishlistItem";
import { OtherUser } from "~/services/user/types";
import { UserDetails } from "~/components/ui/user";
import * as React from "react";

export function ForeignWishlist({ wishlist, owner }: { wishlist: WishlistType; owner: OtherUser }) {
  return (
    <div className="flex size-full flex-col gap-4 pb-4">
      <UserDetails user={owner} />
      <div className="px-4">
        <WishlistItem>
          {wishlist.wishes.length === 0 ? (
            <div>Nothing here yet</div>
          ) : (
            wishlist.wishes.map(wish => <ForeignWish data={wish} key={wish.id} />)
          )}
        </WishlistItem>
      </div>
    </div>
  );
}
