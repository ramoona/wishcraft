"use client";

import { WishType } from "~/services/wishlist/types";
import { DropdownMenu, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { WishStatus } from "@prisma/client";
import { Slider } from "~/components/ui/slider";
import { WishForm } from "~/components/wishlist/own/WishForm";
import * as React from "react";
import { useState } from "react";
import { Gear, Archive, TrashSimple, Gift } from "@phosphor-icons/react";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils/classnames";
import { useDeleteWish, useUpdateWish } from "~/components/wishlist/own/hooks";

export function WishDropdownMenu({
  wish,
  isMobile,
  onActionSuccess,
}: {
  wish: WishType;
  isMobile?: boolean;
  onActionSuccess?: () => void;
}) {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isDeleting, deleteWish] = useDeleteWish();
  const [isUpdating, updateWish] = useUpdateWish();

  return (
    <>
      <DropdownMenu
        trigger={
          <Button variant="outline" size="lg" className="px-4">
            <Gear className="size-6" />{" "}
          </Button>
        }
      >
        {!isMobile && <DropdownMenuItem onSelect={() => setIsSliderOpen(true)}>Edit</DropdownMenuItem>}
        {wish.status !== "FULFILLED" && (
          <DropdownMenuItem onSelect={() => updateWish(wish.id, { status: WishStatus.FULFILLED }, onActionSuccess)}>
            <Gift className="mr-1 size-5" />
            {isUpdating ? "Moving..." : "Move to Fulfilled"}
          </DropdownMenuItem>
        )}
        {wish.status !== "ARCHIVED" && (
          <DropdownMenuItem onSelect={() => updateWish(wish.id, { status: WishStatus.ARCHIVED }, onActionSuccess)}>
            <Archive className="mr-1 size-5" />
            {isUpdating ? "Archiving..." : "Archive"}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onSelect={e => {
            e.preventDefault();
            if (deleteConfirmation) {
              deleteWish(wish.id, onActionSuccess);
              return;
            }

            setDeleteConfirmation(true);
          }}
        >
          <TrashSimple className={cn("mr-1 size-5", deleteConfirmation && "text-red-500")} />
          <span className={cn(deleteConfirmation && "text-red-500")}>
            {isDeleting ? "Deleting..." : deleteConfirmation ? "Really delete?" : "Delete"}
          </span>
        </DropdownMenuItem>
      </DropdownMenu>

      {!isMobile && (
        <Slider isOpen={isSliderOpen} header="Making a wish...">
          <WishForm
            wish={wish}
            onCancel={() => setIsSliderOpen(false)}
            onActionSuccess={() => setIsSliderOpen(false)}
          />
        </Slider>
      )}
    </>
  );
}
