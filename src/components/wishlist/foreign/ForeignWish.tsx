import { WishT as WishT } from "~/types/wishlist";
import { WishStatus } from "@prisma/client";
import { ReserveButton } from "~/components/wishlist/foreign/ReserveButton";
import { WishItem } from "~/components/wishlist/WishItem";
import { Badge } from "~/components/ui/badge";
import { StatusBadge } from "~/components/wishlist/StatusBadge";
import { getSessionUser } from "~/auth/getSessionUser";

function isWishReservable(data: WishT) {
  return data.status === WishStatus.ACTIVE && !data.reservedById;
}

export async function ForeignWish({ data }: { data: WishT }) {
  const sessionUser = await getSessionUser();
  const isReservedByCurrentUser = data.reservedById === sessionUser?.id;

  return (
    <div className="flex gap-2">
      <WishItem data={data} />
      {isReservedByCurrentUser ? (
        <Badge variant="secondary">Reserved by you</Badge>
      ) : (
        <StatusBadge status={data.status} />
      )}
      {isWishReservable(data) && <ReserveButton wishId={data.id} />}
    </div>
  );
}
