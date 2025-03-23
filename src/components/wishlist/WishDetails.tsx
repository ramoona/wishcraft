"use client";

import { WishType } from "~/services/wishlist/types";
import { Price } from "~/components/wishlist/Price";
import { WishSmallArtwork } from "~/components/shapes/WishSmallArtwork";
import React, { useState } from "react";
import { WishStatus } from "~/components/wishlist/WishStatus";
import { WishOverlay } from "~/components/wishlist/WishOverlay";

export function WishDetails({
  reservedByCurrentUser,
  showReserved,
  username,
  isForeign,
  wish,
  isLoggedIn,
}: {
  wish: WishType;
  reservedByCurrentUser?: boolean;
  showReserved?: boolean;
  username?: string;
  isForeign?: boolean;
  isLoggedIn?: boolean;
}) {
  const [isSelected, setIsSelected] = useState(false);
  const { name, isPrivate, price, currency, reservedById, ...visuals } = wish;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsSelected(true)}
        className="relative flex h-20 w-full items-center gap-4 overflow-hidden rounded bg-background pr-5 text-left"
      >
        <WishSmallArtwork {...visuals} />
        <div className="flex grow flex-col items-start gap-2 py-4">
          {username && <span className="text-sm text-foreground/70">{`@${username}'s wish`}</span>}
          <span className="text-sm">{name}</span>
          {!username && (
            <WishStatus
              isPrivate={isPrivate}
              showReserved={showReserved}
              reservedById={reservedById}
              reservedByCurrentUser={reservedByCurrentUser}
              isForeign={isForeign}
            />
          )}
        </div>
        <Price price={price} currency={currency} />
      </button>
      {isSelected && (
        <WishOverlay
          wish={wish}
          onBack={() => setIsSelected(false)}
          showReserved={showReserved}
          isForeign={isForeign}
          reservedByCurrentUser={reservedByCurrentUser}
          username={username}
          isLoggedIn={isLoggedIn}
        />
      )}
    </>
  );
}
