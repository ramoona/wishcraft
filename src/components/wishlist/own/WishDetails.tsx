import { WishType } from "~/services/wishlist/types";
import { Price } from "~/components/wishlist/Price";
import { StatusBadge } from "~/components/wishlist/StatusBadge";
import React from "react";

export function WishDetails({
  currency,
  price,
  name,
  reservedById,
  reservedByCurrentUser,
  showReserved,
  username,
  isPrivate,
  isForeign,
}: WishType & { reservedByCurrentUser?: boolean; showReserved?: boolean; username?: string; isForeign?: boolean }) {
  return (
    <div className="relative flex min-h-20 w-full items-center justify-between gap-4 bg-background px-5 py-4 text-left">
      <div className="flex flex-col items-start gap-2">
        {username && <span className="text-sm text-foreground/70">{`@${username}'s wish`}</span>}
        <span className="text-sm">{name}</span>
        {isPrivate && <StatusBadge status="PRIVATE" />}
        {!isPrivate && (showReserved || isForeign) && reservedById && (
          <StatusBadge status={reservedByCurrentUser ? "RESERVED_BY_CURRENT_USER" : "RESERVED"} />
        )}
      </div>
      <Price price={price} currency={currency} />
    </div>
  );
}
