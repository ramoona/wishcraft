import { WishT as WishT } from "~/services/wishlist/types";
import { WishStatus } from "@prisma/client";
import { ReserveButton } from "~/components/wishlist/foreign/ReserveButton";
import { WishItem } from "~/components/wishlist/WishItem";
import { StatusBadge } from "~/components/wishlist/StatusBadge";
import { getSessionUser } from "~/services/auth";

function isWishReservable(data: WishT) {
  return data.status === WishStatus.ACTIVE || data.status === WishStatus.RESERVED;
}

export async function ForeignWish({ data }: { data: WishT }) {
  const sessionUser = await getSessionUser();
  const isReservedByCurrentUser = !!data.reservedById && data.reservedById === sessionUser?.id;
  const isReservedByAnotherUser = data.reservedById && data.reservedById !== sessionUser?.id;

  return (
    <div className="flex gap-2">
      <WishItem data={data} />
      {isReservedByAnotherUser ? (
        <StatusBadge status={data.status} />
      ) : isWishReservable(data) ? (
        <ReserveButton wishId={data.id} isReserved={isReservedByCurrentUser} />
      ) : null}
    </div>
  );
}
