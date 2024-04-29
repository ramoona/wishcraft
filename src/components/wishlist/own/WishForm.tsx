"use client";

import { WishT } from "~/types/wishlist";
import { Input } from "~/components/ui/input";

export function WishForm({ data }: { data: Omit<WishT, "status" | "reservedById"> }) {
  return (
    <form className="flex gap-2">
      <Input value={data.name} onChange={() => undefined} />
      <Input value={data.price || ""} onChange={() => undefined} />
      <select value={data.currency || ""} onChange={() => undefined}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>
      <Input value={data.url || ""} onChange={() => undefined} />
      <Input value={data.comment || ""} onChange={() => undefined} />
    </form>
  );
}
