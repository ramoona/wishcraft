import { WishType } from "~/services/wishlist/types";
import { Price } from "~/components/wishlist/Price";
import { StatusBadge } from "~/components/wishlist/StatusBadge";
import React from "react";

export function WishDetailsMobile({
  comment,
  currency,
  price,
  name,
  url,
  reservedById,
  reservedByCurrentUser,
  showReserved,
  username,
}: WishType & { reservedByCurrentUser?: boolean; showReserved?: boolean; username?: string }) {
  return (
    <div className="relative w-full rounded border p-4 text-left">
      {username && <span className="text-sm text-foreground/70">{`@${username}'s wish`}</span>}
      {showReserved && reservedById && (
        <div className="absolute -top-3 right-2">
          <StatusBadge status={reservedByCurrentUser ? "RESERVED_BY_CURRENT_USER" : "RESERVED"} />
        </div>
      )}
      <div className="flex items-baseline gap-2">
        <span className={url ? "grow text-left underline" : "grow text-left"}>{name}</span>
        <Price price={price} currency={currency} />
      </div>
      {comment && <span className="mt-4 text-[15px] text-slate-500">{comment}</span>}
    </div>
  );
}

export function WishDetailsDesktop({ data }: { data: Omit<WishType, "status" | "reservedById"> }) {
  return (
    <div className="w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        {data.url ? (
          <a href={data.url} target="_blank">
            {data.name}
          </a>
        ) : (
          <span>{data.name}</span>
        )}
        <Price price={data.price} currency={data.currency} />
      </div>
      <span className="text-xs text-slate-500">{data.comment}</span>
    </div>
  );
}
