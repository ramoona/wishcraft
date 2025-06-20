"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { reserveWishAction, releaseWishAction } from "~/services/wishlist/actions";
import { Button } from "~/components/ui/button";
import { SignInButton } from "~/components/forms/SignInForm";
import { WishlistReservationFormData } from "~/services/wishlist/formData";

import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/errorMessages";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";

export function ReserveButton({
  wishId,
  isReserved,
  isLoggedIn,
  username,
}: {
  wishId: string;
  isReserved?: boolean;
  isLoggedIn?: boolean;
  username?: string;
}) {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const [isPending, startTransition] = useTransition();
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);

  const { t } = useTranslation();

  const triggerReserveWishAction = () => {
    if (!isLoggedIn) {
      setAuthDialogOpen(true);
      return;
    }

    startTransition(async () => {
      const { error } = await reserveWishAction(WishlistReservationFormData.fromObject({ wishId }));

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
      const { error } = await releaseWishAction(WishlistReservationFormData.fromObject({ wishId }));

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
    <>
      <Button onClick={isReserved ? triggerReleaseWishAction : triggerReserveWishAction} size="lg">
        {isPending && (isReserved ? t("states.cancelling") : t("states.reserving"))}
        {!isPending && (isReserved ? t("actions.cancelReservation") : t("actions.reserve"))}
      </Button>
      <Dialog open={isAuthDialogOpen} onOpenChange={open => setAuthDialogOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("loginModal.title")}</DialogTitle>
            <DialogDescription asChild>
              <div className="mt-4">
                {t("loginModal.description", { username })}
                <div className="mt-8 flex justify-center">
                  <SignInButton wishId={wishId} wishlistOwner={params.username} />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
