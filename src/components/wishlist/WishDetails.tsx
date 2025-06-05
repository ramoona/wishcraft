"use client";

import { WishType } from "~/services/wishlist/types";
import { Price } from "~/components/wishlist/Price";
import { WishSmallArtwork } from "~/components/shapes/WishSmallArtwork";
import React, { useState } from "react";
import { WishStatus } from "~/components/wishlist/WishStatus";
import { WishOverlay } from "~/components/wishlist/WishOverlay";
import { useTranslation } from "react-i18next";

export function WishDetails({
  reservedByCurrentUser,
  showReserved,
  username,
  isForeign,
  wish,
  isLoggedIn,
  showUsernameInDetails = false,
}: {
  wish: WishType;
  reservedByCurrentUser?: boolean;
  showReserved?: boolean;
  username?: string;
  isForeign?: boolean;
  isLoggedIn?: boolean;
  showUsernameInDetails?: boolean;
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
          {showUsernameInDetails && username && (
            <span className="text-sm text-foreground/70">{t("wishlist.wishOwner", { username })}</span>
          )}
          <span className="max-h-8 truncate text-sm">{name}</span>
          {!showUsernameInDetails && (
            <WishStatus
              username={username}
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
