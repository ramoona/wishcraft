import { WishType } from "~/services/wishlist/types";
import { getSessionUser } from "~/services/session";
import { WishDetails } from "~/components/wishlist/WishDetails";
import React from "react";

export async function ForeignWish({ data }: { data: WishType }) {
  const sessionUser = await getSessionUser();
  const isReservedByCurrentUser = !!data.reservedById && data.reservedById === sessionUser?.id;

  return (
    <WishDetails wish={data} reservedByCurrentUser={isReservedByCurrentUser} isLoggedIn={!!sessionUser} isForeign />
  );
}
