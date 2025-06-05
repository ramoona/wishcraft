import { WishlistType } from "~/services/wishlist/types";
import { ForeignWish } from "~/components/wishlist/foreign/ForeignWish";
import { WishlistItems } from "~/components/wishlist/WishlistItems";
import { OtherUser } from "~/services/user/types";
import { UserDetails } from "~/components/ui/user";
import * as React from "react";
import { AddFriendButton } from "~/components/friends/AddFriendButton";
import { EmptyList } from "~/components/ui/emptyList";
import { FriendDropdownMenu } from "~/components/friends/FriendDropdownMenu";
import { WithStickyFooter } from "~/components/ui/scrollable";

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
    <WithStickyFooter footer={isLoggedIn && !owner.isFriend ? <AddFriendButton friendId={owner.id} /> : null}>
      <div className="flex h-full flex-col pb-4">
        <div className="sticky top-0 z-10 grid w-full grid-cols-[auto_max-content] items-center bg-background pr-4">
          <UserDetails user={owner} context="wishlist" />
          {isLoggedIn && owner.isFriend && <FriendDropdownMenu friendId={owner.id} />}
        </div>
        <div className="mx-auto w-full max-w-lg grow bg-muted px-4 pt-4 shadow-[0_-10px_0_5px_#fff] sm:rounded-t">
          {wishlist.wishes.length === 0 ? (
            <div className="mx-auto flex h-full items-center justify-center">
              <EmptyList shape="4" />
            </div>
          ) : (
            <WishlistItems>
              {wishlist.wishes.map(wish => (
                <ForeignWish data={wish} key={wish.id} username={owner.username} />
              ))}
            </WishlistItems>
          )}
        </div>
      </div>
    </WithStickyFooter>
  );
}
