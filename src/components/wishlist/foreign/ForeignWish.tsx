import { WishType as WishT } from "~/services/wishlist/types";
import { ReserveButton } from "~/components/wishlist/foreign/ReserveButton";
import { getSessionUser } from "~/services/session";
import { WishDetails } from "~/components/wishlist/own/WishDetails";
import React from "react";

export async function ForeignWish({ data }: { data: WishT }) {
  const sessionUser = await getSessionUser();
  const isReservedByCurrentUser = !!data.reservedById && data.reservedById === sessionUser?.id;

  const isWishReservable = isReservedByCurrentUser || !data.reservedById;

  return (
    <div className={`relative flex w-full flex-col gap-2 ${isWishReservable ? "mb-4" : ""}`}>
      <WishDetails {...data} reservedByCurrentUser={isReservedByCurrentUser} isForeign />
      {isWishReservable && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[22px]">
          <ReserveButton wishId={data.id} isReserved={isReservedByCurrentUser} isLoggedIn={!!sessionUser} />
        </div>
      )}
    </div>
  );
}
