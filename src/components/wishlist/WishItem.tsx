"use client";

import { WishT } from "~/types/wishlist";
import { Price } from "~/components/wishlist/Price";

export function WishItem({ data }: { data: Omit<WishT, "status" | "reservedById"> }) {
  return (
    <div className="flex gap-2">
      {data.url ? (
        <a href={data.url} target="_blank">
          {data.name}
        </a>
      ) : (
        <span>{data.name}</span>
      )}
      <Price price={data.price} currency={data.currency} />
      <span>{data.comment}</span>
    </div>
  );
}
