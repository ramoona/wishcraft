import { WishT as WishT } from "~/types/wishlist";
import { WishStatus } from "@prisma/client";
import { ReserveButton } from "~/components/wishlist/foreign/ReserveButton";
import { getServerSession } from "~/auth/getServerSession";
import { redirect } from "next/navigation";

const statusMap = {
  [WishStatus.RESERVED]: "Reserved",
  [WishStatus.ARCHIVED]: "Archived",
  [WishStatus.BOUGHT]: "Bought",
  [WishStatus.AVAILABLE]: "Available",
  [WishStatus.GIFTED]: "Gifted",
};

function isWishReservable(data: WishT) {
  return data.status === WishStatus.AVAILABLE && !data.reservedById;
}

export async function ForeignWish({ data }: { data: WishT }) {
  const session = await getServerSession();
  const userId = session?.user.id;

  if (!userId) {
    redirect("/");
  }

  const price = data.price !== null && data.currency ? `${data.price} ${data.currency}` : "";
  const isReservedByCurrentUser = data.reservedById === userId;

  return (
    <>
      {data.url ? (
        <a href={data.url} target="_blank">
          {data.name}
        </a>
      ) : (
        <span>{data.name}</span>
      )}
      <span>{price}</span>
      <span>{data.comment || ""}</span>
      <div className="p-2">{isReservedByCurrentUser ? "Reserved by you" : statusMap[data.status]}</div>
      <div>{isWishReservable(data) && <ReserveButton wishId={data.id} />}</div>
    </>
  );
}
