import { StatusBadge } from "~/components/wishlist/StatusBadge";
import React from "react";
import { WishType } from "~/services/wishlist/types";
import { usePathname } from "next/navigation";

export function WishStatus({
  isPrivate,
  showReserved,
  isForeign,
  reservedByCurrentUser,
  reservedById,
}: Pick<WishType, "isPrivate" | "reservedById"> & {
  reservedByCurrentUser?: boolean;
  showReserved?: boolean;
  isForeign?: boolean;
}) {
  const pathname = usePathname();
  const isReservedWishesRoute = pathname.includes("reserved-wishes");
  const showReservedBadge =
    !isPrivate && reservedById && (showReserved || isForeign) && !(isReservedWishesRoute && reservedByCurrentUser);

  if (isPrivate) {
    return <StatusBadge status="PRIVATE" />;
  }

  if (showReservedBadge) {
    return <StatusBadge status={reservedByCurrentUser ? "RESERVED_BY_CURRENT_USER" : "RESERVED"} />;
  }
  return null;
}
