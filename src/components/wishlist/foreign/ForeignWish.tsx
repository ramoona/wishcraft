import { WishType as WishT } from "~/services/wishlist/types";
import { ReserveButton } from "~/components/wishlist/foreign/ReserveButton";
import { WishDetails } from "~/components/wishlist/WishDetails";
import { StatusBadge } from "~/components/wishlist/StatusBadge";
import { getSessionUser } from "~/services/session";
import { WishDetailsMobile } from "~/components/wishlist/own/WishDetails";
import React from "react";

export async function ForeignWish({ data, isMobile = true }: { data: WishT; isMobile: boolean }) {
  const sessionUser = await getSessionUser();
  const isReservedByCurrentUser = !!data.reservedById && data.reservedById === sessionUser?.id;
  const isReservedByAnotherUser = data.reservedById && data.reservedById !== sessionUser?.id;

  const isWishReservable = isReservedByCurrentUser || !data.reservedById;

  if (isMobile) {
    return (
      <div className={`relative flex w-full flex-col gap-2 ${isWishReservable ? "mb-4" : ""}`}>
        <WishDetailsMobile {...data} reservedByCurrentUser={isReservedByCurrentUser} />
        {/*{isWishReservable && (*/}
        {/*  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[22px]">*/}
        {/*    <ReserveButton wishId={data.id} isReserved={isReservedByCurrentUser} isLoggedIn={!!sessionUser} isMobile />*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <WishDetails data={data} />
      {isReservedByAnotherUser ? (
        <StatusBadge status={data.status} />
      ) : isWishReservable ? (
        <ReserveButton wishId={data.id} isReserved={isReservedByCurrentUser} isMobile={false} />
      ) : null}
    </div>
  );
}
