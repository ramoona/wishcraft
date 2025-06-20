"use client";

import { WishType } from "~/services/wishlist/types";
import { WishlistItemsDesktop, WishlistItemsMobile } from "~/components/wishlist/WishlistItems";
import { WishDetails } from "~/components/wishlist/WishDetails";
import * as React from "react";
import { WishCard } from "~/components/wishlist/WishCard";
import { OtherUser } from "~/services/user/types";

type Props = {
  wishes: (WishType & { user: OtherUser })[];
  reservedByCurrentUser?: boolean;
};

export function ForeignWishesWishesMobile({ wishes, reservedByCurrentUser }: Props) {
  return (
    <WishlistItemsMobile>
      {wishes.map(wish => {
        return (
          <WishDetails
            key={wish.id}
            wish={wish}
            username={wish.user.username}
            isForeign
            reservedByCurrentUser={reservedByCurrentUser}
            isLoggedIn
            showUsernameInDetails
          />
        );
      })}
    </WishlistItemsMobile>
  );
}

export function ForeignWishesWishesDesktop({ wishes, reservedByCurrentUser }: Props) {
  return (
    <WishlistItemsDesktop wishes={wishes}>
      {wishes.map(wish => (
        <WishCard
          key={wish.id}
          wish={wish}
          username={wish.user.username}
          isForeign
          reservedByCurrentUser={reservedByCurrentUser}
          isLoggedIn
        />
      ))}
    </WishlistItemsDesktop>
  );
}
