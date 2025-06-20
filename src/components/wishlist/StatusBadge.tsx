"use client";

import { WishStatus } from "@prisma/client";
import { Badge } from "~/components/ui/badge";
import React from "react";
import { useTranslation } from "react-i18next";

export function StatusBadge({ status }: { status: WishStatus | "RESERVED" | "RESERVED_BY_CURRENT_USER" | "PRIVATE" }) {
  const { t } = useTranslation();

  switch (status) {
    case "RESERVED":
      return <Badge variant="reserved">{t("wishlist.wishStatus.reserved")}</Badge>;
    case "RESERVED_BY_CURRENT_USER":
      return <Badge variant="reservedByYou">{t("wishlist.wishStatus.reservedByYou")}</Badge>;
    case "PRIVATE":
      return <Badge variant="default">{t("wishlist.wishStatus.private")}</Badge>;
    default:
      return null;
  }
}
