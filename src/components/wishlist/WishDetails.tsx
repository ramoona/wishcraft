"use client";

import { WishType } from "~/services/wishlist/types";
import { Price } from "~/components/wishlist/Price";

export function WishDetails({ data }: { data: Omit<WishType, "status" | "reservedById"> }) {
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
