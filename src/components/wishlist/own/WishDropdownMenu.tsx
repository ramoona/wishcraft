"use client";

import { WishType } from "~/services/wishlist/types";
import { DropdownMenu, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { WishStatus } from "@prisma/client";
import * as React from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils/classnames";
import { useDeleteWish, useUpdateWish } from "~/components/wishlist/own/hooks";

export function WishDropdownMenu({ wish, onActionSuccess }: { wish: WishType; onActionSuccess?: () => void }) {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isDeleting, deleteWish] = useDeleteWish();
  const [isUpdating, updateWish] = useUpdateWish();

  return (
    <>
      <DropdownMenu
        trigger={
          <Button
            variant="outline"
            size="lg"
            className="flex items-center justify-center gap-1 px-4"
            aria-label="Profile dropdown menu"
            minWidth={false}
            fullWidth
          >
            <div className={`size-1 rounded-full bg-black`} />
            <div className={`size-1 rounded-full bg-black`} />
            <div className={`size-1 rounded-full bg-black`} />
          </Button>
        }
      >
        {wish.status !== "FULFILLED" && (
          <DropdownMenuItem onSelect={() => updateWish(wish.id, { status: WishStatus.FULFILLED }, onActionSuccess)}>
            {isUpdating ? "Moving..." : "Move to Fulfilled"}
          </DropdownMenuItem>
        )}
        {wish.status !== "ARCHIVED" && (
          <DropdownMenuItem onSelect={() => updateWish(wish.id, { status: WishStatus.ARCHIVED }, onActionSuccess)}>
            {isUpdating ? "Archiving..." : "Archive"}
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
            {isDeleting ? "Deleting..." : deleteConfirmation ? "Really delete?" : "Delete"}
          </span>
        </DropdownMenuItem>
      </DropdownMenu>
    </>
  );
}
