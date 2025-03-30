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
        {isPending && (isReserved ? "Canceling..." : "Reserving...")}
        {!isPending && (isReserved ? "Cancel reservation" : "Reserve")}
      </Button>
      <Dialog open={isAuthDialogOpen} onOpenChange={open => setAuthDialogOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please sign in to continue</DialogTitle>
            <DialogDescription asChild>
              <div className="mt-4">
                To keep track of who reserved what we are kindly asking you to sign in. Don&#39;t worry, we won&#39;t
                tell {username ? `@${username}` : "wishlist owner"} that it was you.
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
