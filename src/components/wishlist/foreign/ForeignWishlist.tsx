import { WishlistType } from "~/services/wishlist/types";
import { ForeignWish } from "~/components/wishlist/foreign/ForeignWish";
import { WishlistItem } from "~/components/wishlist/WishlistItem";
import { OtherUser } from "~/services/user/types";
import { UserDetails } from "~/components/ui/user";
import * as React from "react";
import { FriendActionButton } from "~/components/friends/FriendActionButton";

export function ForeignWishlist({
  wishlist,
  owner,
  isLoggedIn,
}: {
  wishlist: WishlistType;
  owner: OtherUser;
  isLoggedIn: boolean;
}) {
  return (
    <>
      <div>
        <UserDetails user={owner} sticky />
        <div className="px-4 pt-4">
          <WishlistItem>
            {wishlist.wishes.length === 0 ? (
              <div>Nothing here yet</div>
            ) : (
              wishlist.wishes.map(wish => <ForeignWish data={wish} key={wish.id} />)
            )}
          </WishlistItem>
        </div>
      </div>
      <div className="my-4 px-4">
        <div className="flex items-center justify-center gap-4">
          {isLoggedIn ? <FriendActionButton friendId={owner.id} isFriend={owner.isFriend} /> : null}
        </div>
      </div>
    </>
  );
}
