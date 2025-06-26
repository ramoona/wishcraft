"use client";

import { WishType } from "~/services/wishlist/types";
import { Price } from "~/components/wishlist/Price";
import { WishSmallArtwork } from "~/components/shapes/WishSmallArtwork";
import React, { useState } from "react";
import { WishStatus } from "~/components/wishlist/WishStatus";
import { useTranslation } from "react-i18next";
import { WishModal } from "~/components/wishlist/WishModal";

export function WishDetails({
  reservedByCurrentUser,
  showReserved,
  username,
  isForeign,
  wish,
  isLoggedIn,
  withOwnerUsername = false,
}: {
  wish: WishType;
  reservedByCurrentUser?: boolean;
  showReserved?: boolean;
  username: string;
  isForeign?: boolean;
  isLoggedIn?: boolean;
  withOwnerUsername?: boolean;
}) {
  const [isSelected, setIsSelected] = useState(false);
  const { name, isPrivate, price, currency, reservedById, ...visuals } = wish;
  const { t } = useTranslation();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsSelected(true)}
        className="relative grid h-20 w-full grid-cols-[max-content_auto_max-content] items-center gap-4 overflow-hidden rounded bg-background pr-5 text-left ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      >
        <WishSmallArtwork {...visuals} />
        <div className="grid justify-start space-y-2 py-4">
          {withOwnerUsername && (
            <span className="text-sm text-foreground/70">
              {t("wishlist.wishOwner", { username: wish.owner.username })}
            </span>
          )}
          <span className="max-h-8 truncate text-sm">{name}</span>
          {!withOwnerUsername && (
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
      <WishModal
        isOpen={isSelected}
        wish={wish}
        onOpenChange={setIsSelected}
        showReserved={showReserved}
        isForeign={isForeign}
        reservedByCurrentUser={reservedByCurrentUser}
        username={username}
        isLoggedIn={isLoggedIn}
        withOwnerUsername={withOwnerUsername}
      />
    </>
  );
}
