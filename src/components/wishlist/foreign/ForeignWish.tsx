import { WishT as WishT } from "~/types/wishlist";
import { WishStatus } from "@prisma/client";
import { ReserveButton } from "~/components/wishlist/foreign/ReserveButton";
import { getServerSession } from "~/auth/getServerSession";
import { redirect } from "next/navigation";
import { WishItem } from "~/components/wishlist/WishItem";
import { Badge } from "~/components/ui/badge";
import { StatusBadge } from "~/components/wishlist/StatusBadge";

function isWishReservable(data: WishT) {
  return data.status === WishStatus.ACTIVE && !data.reservedById;
}

export async function ForeignWish({ data }: { data: WishT }) {
  const session = await getServerSession();
  const userId = session?.user.id;

  if (!userId) {
    redirect("/");
  }

  const isReservedByCurrentUser = data.reservedById === userId;

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
