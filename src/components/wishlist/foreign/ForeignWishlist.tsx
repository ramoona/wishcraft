import { WishlistType } from "~/services/wishlist/types";
import { ForeignWish } from "~/components/wishlist/foreign/ForeignWish";
import { WishlistItems } from "~/components/wishlist/WishlistItems";
import { OtherUser } from "~/services/user/types";
import { UserDetails } from "~/components/ui/user";
import * as React from "react";
import { FriendActionButtons } from "~/components/friends/FriendActionButtons";

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
        <div className="mx-auto w-full max-w-lg bg-muted px-4 pt-4 shadow-[0_-10px_0_5px_#fff] sm:rounded-t">
          <WishlistItems>
            {wishlist.wishes.length === 0 ? (
              <div>Nothing here yet</div>
            ) : (
              wishlist.wishes.map(wish => <ForeignWish data={wish} key={wish.id} username={owner.username} />)
            )}
          </WishlistItems>
        </div>
      </div>
      {isLoggedIn ? <FriendActionButtons friendId={owner.id} isFriend={owner.isFriend} /> : null}
    </>
  );
}
