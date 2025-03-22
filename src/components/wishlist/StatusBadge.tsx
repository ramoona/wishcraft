"use client";

import { WishStatus } from "@prisma/client";
import { Badge } from "~/components/ui/badge";
import React from "react";

export function StatusBadge({ status }: { status: WishStatus | "RESERVED_BY_CURRENT_USER" | "PRIVATE" }) {
  switch (status) {
    case WishStatus.RESERVED:
      return <Badge variant="reserved">Reserved</Badge>;
    case "RESERVED_BY_CURRENT_USER":
      return <Badge variant="reservedByYou">Reserved by you</Badge>;
    case "PRIVATE":
      return <Badge variant="default">Private</Badge>;
    default:
      return null;
  }
}
