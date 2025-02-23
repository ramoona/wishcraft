import { WishType as WishT } from "~/services/wishlist/types";
import { ReserveButton } from "~/components/wishlist/foreign/ReserveButton";
import { WishDetails } from "~/components/wishlist/WishDetails";
import { WishDetailsMobile } from "~/components/wishlist/own/WishDetails";
import React from "react";
import { OtherUser } from "~/services/user/types";

export function ForeignWishReserved({
  wish,
  isMobile = true,
  user,
}: {
  wish: WishT;
  isMobile: boolean;
  user: OtherUser;
}) {
  if (isMobile) {
    return (
      <div className={`relative mb-4 flex w-full flex-col gap-2`}>
        <WishDetailsMobile {...wish} username={user.username ?? undefined} />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <span>{`${user.username}'s wish`}</span>
      <WishDetails data={wish} />
      <ReserveButton wishId={wish.id} isReserved={true} isMobile={false} />
    </div>
  );
}
