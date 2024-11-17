"use client";

import { WishStatus } from "@prisma/client";
import { Badge } from "~/components/ui/badge";
import { Gift } from "@phosphor-icons/react";
import React from "react";

export function StatusBadge({ status }: { status: WishStatus | "RESERVED_BY_CURRENT_USER" }) {
  switch (status) {
    case WishStatus.RESERVED:
      return (
        <Badge variant="outline">
          <Gift className="size-4" />
          <span className="ml-1">Reserved</span>
        </Badge>
      );
    case "RESERVED_BY_CURRENT_USER":
      return (
        <Badge variant="attention">
          <Gift className="size-4" />
          <span className="ml-1">Reserved by you</span>
        </Badge>
      );
    default:
      return null;
  }
}
