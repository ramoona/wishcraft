import { StatusBadge } from "~/components/wishlist/StatusBadge";
import React from "react";
import { WishType } from "~/services/wishlist/types";

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
  const showReservedBadge = !isPrivate && (showReserved || isForeign) && reservedById;

  if (isPrivate) {
    return <StatusBadge status="PRIVATE" />;
  }

  if (showReservedBadge) {
    return <StatusBadge status={reservedByCurrentUser ? "RESERVED_BY_CURRENT_USER" : "RESERVED"} />;
  }
  return null;
}
