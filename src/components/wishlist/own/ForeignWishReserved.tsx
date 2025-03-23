import { WishType as WishT } from "~/services/wishlist/types";
import { WishDetails } from "~/components/wishlist/WishDetails";
import React from "react";
import { OtherUser } from "~/services/user/types";

export function ForeignWishReserved({ wish, user }: { wish: WishT; user: OtherUser }) {
  return <WishDetails wish={wish} username={user.username ?? undefined} isForeign />;
}
