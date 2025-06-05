"use client";

import { WishType } from "~/services/wishlist/types";
import { DropdownMenu, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { WishStatus } from "@prisma/client";
import * as React from "react";
import { useState } from "react";
import { cn } from "~/utils/classnames";
import { useDeleteWish, useUpdateWish } from "~/components/wishlist/own/hooks";
import { useTranslation } from "react-i18next";

export function WishDropdownMenu({ wish, onActionSuccess }: { wish: WishType; onActionSuccess?: () => void }) {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isDeleting, deleteWish] = useDeleteWish();
  const [isUpdating, updateWish] = useUpdateWish();
  const { t } = useTranslation();

  return (
    <div className="absolute right-4 top-4 z-10">
      <DropdownMenu ariaLabel="Wish menu">
        {wish.status !== "FULFILLED" && (
          <DropdownMenuItem onSelect={() => updateWish(wish.id, { status: WishStatus.FULFILLED }, onActionSuccess)}>
            {isUpdating ? t("states.moving") : t("actions.moveWishToFulfilled")}
          </DropdownMenuItem>
        )}
        {wish.status !== "ARCHIVED" && (
          <DropdownMenuItem onSelect={() => updateWish(wish.id, { status: WishStatus.ARCHIVED }, onActionSuccess)}>
            {isUpdating ? t("states.archiving") : t("actions.archive")}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="min-w-48 bg-destructive/10 text-destructive hover:bg-destructive/20"
          onSelect={e => {
            e.preventDefault();
            if (deleteConfirmation) {
              deleteWish(wish.id, onActionSuccess);
              return;
            }

            setDeleteConfirmation(true);
          }}
        >
          <span className={cn(deleteConfirmation && "text-red-500")}>
            {isDeleting ? t("states.deleting") : deleteConfirmation ? t("actions.reallyDelete") : t("actions.delete")}
          </span>
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  );
}
