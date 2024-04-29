"use client";

import { WishT } from "~/types/wishlist";
import { Price } from "~/components/wishlist/Price";

export function WishItem({ data }: { data: Omit<WishT, "status" | "reservedById"> }) {
  return (
    <div className="flex-col gap-2">
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
