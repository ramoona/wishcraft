"use client";

import { WishType } from "~/services/wishlist/types";
import { DropdownMenuContent, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { WishStatus } from "@prisma/client";
import * as React from "react";
import { useState, useTransition } from "react";
import { cn } from "~/utils/classnames";
import { useDeleteWish, useUpdateWish } from "~/components/wishlist/own/hooks";
import { useTranslation } from "react-i18next";
import { DesktopOnly } from "~/components/MediaComponents";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { buttonVariants } from "~/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { releaseWishAction, reserveWishAction } from "~/services/wishlist/actions";
import { WishlistReservationFormData } from "~/services/wishlist/form-data";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/error-messages";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { SignInButton } from "~/components/forms/SignInForm";

export function OwnWishDropdownMenu({
  wish,
  onActionSuccess,
  onEdit,
  side = "right",
}: {
  wish: WishType;
  onActionSuccess?: () => void;
  onEdit?: () => void;
  side?: "left" | "right";
}) {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isDeleting, deleteWish] = useDeleteWish();
  const [isUpdating, updateWish] = useUpdateWish();
  const { t } = useTranslation();

  return (
    <div className="absolute right-4 top-4 z-10 lg:relative lg:-top-0.5 lg:right-0">
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger
          aria-label="Wish menu"
          className={cn(
            buttonVariants({ variant: "outline", minWidth: false, fullWidth: false }),
            "relative z-10 flex size-10 items-center justify-center gap-[3px] rounded-full bg-white px-0",
            "lg:h-8 lg:w-4 lg:flex-col lg:border-0 lg:p-0",
            "transition-colors duration-150 hover:bg-[#D8D6D6] lg:hover:bg-[#eeeeee]",
          )}
        >
          <div className={cn(`size-[3px] rounded-full bg-black`)} />
          <div className={cn(`size-[3px] rounded-full bg-black`)} />
          <div className={cn(`size-[3px] rounded-full bg-black`)} />
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuContent side={side} align="start">
          {wish.status === "ACTIVE" && (
            <DesktopOnly>
              <DropdownMenuItem onSelect={onEdit}>{t("actions.edit")}</DropdownMenuItem>
            </DesktopOnly>
          )}
          {wish.status !== "ACTIVE" && (
            <DesktopOnly>
              <DropdownMenuItem onSelect={() => updateWish(wish.id, { status: WishStatus.ACTIVE }, onActionSuccess)}>
                {t("actions.moveWishToActive")}
              </DropdownMenuItem>
            </DesktopOnly>
          )}
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
        </DropdownMenuContent>
      </DropdownMenuPrimitive.Root>
    </div>
  );
}

export function ForeignWishDropdownMenu({
  wish,
  isLoggedIn,
  reservedByCurrentUser,
}: {
  wish: WishType;
  isLoggedIn?: boolean;
  reservedByCurrentUser?: boolean;
}) {
  const { t } = useTranslation();

  const router = useRouter();
  const params = useParams<{ username: string }>();

  const [isPending, startTransition] = useTransition();
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);

  const triggerReserveWishAction = () => {
    if (!isLoggedIn) {
      setAuthDialogOpen(true);
      return;
    }

    startTransition(async () => {
      const { error } = await reserveWishAction(WishlistReservationFormData.fromObject({ wishId: wish.id }));

      if (error) {
        if (error === "UNAUTHORIZED") {
          setAuthDialogOpen(true);
        } else {
          showErrorToast(getErrorMessage(error, t));
        }
        return;
      }

      router.refresh();
    });
  };

  const triggerReleaseWishAction = () => {
    if (!isLoggedIn) {
      setAuthDialogOpen(true);
      return;
    }

    startTransition(async () => {
      const { error } = await releaseWishAction(WishlistReservationFormData.fromObject({ wishId: wish.id }));

      if (error) {
        if (error === "UNAUTHORIZED") {
          setAuthDialogOpen(true);
        } else {
          showErrorToast(getErrorMessage(error, t));
        }
        return;
      }

      router.refresh();
    });
  };

  return (
    <div className="absolute right-4 top-4 z-10 lg:relative lg:-top-0.5 lg:right-0">
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger
          aria-label="Wish menu"
          className={cn(
            buttonVariants({ variant: "outline", minWidth: false, fullWidth: false }),
            "relative z-10 flex size-10 items-center justify-center gap-[3px] rounded-full bg-white px-0",
            "lg:h-8 lg:w-4 lg:flex-col lg:border-0 lg:p-0",
            "transition-colors duration-150 hover:bg-[#D8D6D6] lg:hover:bg-[#eeeeee]",
          )}
        >
          <div className={cn(`size-[3px] rounded-full bg-black`)} />
          <div className={cn(`size-[3px] rounded-full bg-black`)} />
          <div className={cn(`size-[3px] rounded-full bg-black`)} />
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuContent side="right" align="start">
          {wish.status === "ACTIVE" && (
            <DesktopOnly>
              <DropdownMenuItem onSelect={reservedByCurrentUser ? triggerReleaseWishAction : triggerReserveWishAction}>
                {isPending && (reservedByCurrentUser ? t("states.cancelling") : t("states.reserving"))}
                {!isPending && (reservedByCurrentUser ? t("actions.cancelReservation") : t("actions.reserve"))}
              </DropdownMenuItem>
            </DesktopOnly>
          )}
        </DropdownMenuContent>
      </DropdownMenuPrimitive.Root>
      <Dialog open={isAuthDialogOpen} onOpenChange={open => setAuthDialogOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("loginModal.title")}</DialogTitle>
            <DialogDescription asChild>
              <div className="mt-4">
                {t("loginModal.description", { username: params.username })}
                <div className="mt-8 flex justify-center">
                  <SignInButton wishId={wish.id} wishlistOwner={params.username} />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
