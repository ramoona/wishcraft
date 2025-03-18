import { WishType as WishT } from "~/services/wishlist/types";
import { WishDetails } from "~/components/wishlist/own/WishDetails";
import React from "react";
import { OtherUser } from "~/services/user/types";

export function ForeignWishReserved({ wish, user }: { wish: WishT; user: OtherUser }) {
  return (
    <div className={`relative mb-4 flex w-full flex-col gap-2`}>
      <WishDetails {...wish} username={user.username ?? undefined} />
    </div>
  );
}
