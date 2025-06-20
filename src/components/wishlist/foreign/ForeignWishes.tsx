"use client";

import { WishType } from "~/services/wishlist/types";
import { WishlistItemsDesktop, WishlistItemsMobile } from "~/components/wishlist/WishlistItems";
import { WishDetails } from "~/components/wishlist/WishDetails";
import * as React from "react";
import { WishCard } from "~/components/wishlist/WishCard";
import { OtherUser, User } from "~/services/user/types";

type Props = {
  wishes: (WishType & { user?: OtherUser })[];
  currentUser?: User | null;
};

export function ForeignWishesWishesMobile({ wishes, currentUser }: Props) {
  return (
    <WishlistItemsMobile>
      {wishes.map(wish => {
        return (
          <WishDetails
            key={wish.id}
            wish={wish}
            username={wish.user?.username}
            reservedByCurrentUser={wish.reservedById === currentUser?.id}
            isLoggedIn={!!currentUser}
            showUsernameInDetails
            isForeign
          />
        );
      })}
    </WishlistItemsMobile>
  );
}

export function ForeignWishesWishesDesktop({ wishes, currentUser }: Props) {
  return (
    <WishlistItemsDesktop wishes={wishes}>
      {wishes.map(wish => (
        <WishCard
          key={wish.id}
          wish={wish}
          username={wish.user?.username}
          reservedByCurrentUser={wish.reservedById === currentUser?.id}
          isLoggedIn={!!currentUser}
          isForeign
        />
      ))}
    </WishlistItemsDesktop>
  );
}
