"use client";

import { WishT } from "~/services/wishlist/types";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { WishStatus } from "@prisma/client";
import { Slider } from "~/components/ui/slider";
import { WishForm, WishFormValues } from "~/components/wishlist/own/WishForm";
import * as React from "react";
import { useState } from "react";
import { deleteWishAction, updateWishAction } from "~/services/wishlist/actions";
import { WishDeletionFormData, WishUpdateFormData } from "~/services/wishlist/formData";
import { useRouter } from "next/navigation";
import { showToastWithActionResult } from "~/core/showToastWithActionResult";

export function WishDropdownMenu({ wish }: { wish: WishT }) {
  const router = useRouter();
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const handleEditWish = async (values: WishFormValues) => {
    const { error } = await updateWishAction(WishUpdateFormData.fromObject({ id: wish.id, ...values }));
    showToastWithActionResult("UPDATED", error);
    router.refresh();
    setIsSliderOpen(false);
  };

  const handleUpdateWishStatus = async (status: WishStatus) => {
    const { error } = await updateWishAction(WishUpdateFormData.fromObject({ id: wish.id, status }));
    showToastWithActionResult("UPDATED", error);
    router.refresh();
  };

  const handleDeleteWishStatus = async () => {
    const { error } = await deleteWishAction(WishDeletionFormData.fromObject({ id: wish.id }));
    showToastWithActionResult("DELETED", error);
    router.refresh();
  };

  if (wish.status === WishStatus.ARCHIVED) {
    return (
      <DropdownMenu>
        <DropdownMenuItem onSelect={() => setIsSliderOpen(true)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onSelect={handleDeleteWishStatus}>Delete</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Changed your mind?</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => handleUpdateWishStatus(WishStatus.ACTIVE)}>I want it again</DropdownMenuItem>
      </DropdownMenu>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuItem onSelect={() => setIsSliderOpen(true)}>Edit</DropdownMenuItem>
        {wish.status === WishStatus.FULFILLED && (
          <DropdownMenuItem onSelect={() => handleUpdateWishStatus(WishStatus.FULFILLED)}>
            Mark as Active
          </DropdownMenuItem>
        )}
        {wish.status !== WishStatus.FULFILLED && (
          <DropdownMenuItem onSelect={() => handleUpdateWishStatus(WishStatus.FULFILLED)}>
            Mark as Fulfilled
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={() => handleUpdateWishStatus(WishStatus.ARCHIVED)}>Archive</DropdownMenuItem>
        <DropdownMenuItem
          onSelect={async e => {
            e.preventDefault();
            if (deleteConfirmation) {
              await handleDeleteWishStatus();
              return;
            }

            setDeleteConfirmation(true);
          }}
        >
          {deleteConfirmation ? "Really delete?" : "Delete"}
        </DropdownMenuItem>
      </DropdownMenu>

      <Slider isOpen={isSliderOpen} header="Making a wish...">
        <WishForm data={wish} onCancel={() => setIsSliderOpen(false)} onSubmit={handleEditWish} />
      </Slider>
    </>
  );
}
