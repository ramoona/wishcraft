"use client";

import { WishT } from "~/types/wishlist";

export function WishForm({ data }: { data: Omit<WishT, "status" | "reservedById"> }) {
  return (
    <form className="flex gap-2">
      <input value={data.name} onChange={() => undefined} />
      <input value={data.price || ""} onChange={() => undefined} />
      <select value={data.currency || ""} onChange={() => undefined}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>
      <input value={data.url || ""} onChange={() => undefined} />
      <input value={data.comment || ""} onChange={() => undefined} />
    </form>
  );
}
