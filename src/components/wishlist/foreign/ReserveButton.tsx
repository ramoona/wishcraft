"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { reserveWishAction, releaseWishAction } from "~/services/wishlist/actions";
import { Button } from "~/components/ui/button";
import { SignInButton } from "~/components/forms/SignInForm";
import { WishlistReservationFormData } from "~/services/wishlist/formData";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/errorMessages";
import { useTranslation } from "react-i18next";

export function ReserveButton({
  wishId,
  isReserved,
  isLoggedIn,
}: {
  wishId: string;
  isReserved?: boolean;
  isLoggedIn?: boolean;
}) {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const [isPending, startTransition] = useTransition();
  const [isSliderOpen, setSliderOpen] = useState(false);

  const { t } = useTranslation();

  const triggerReserveWishAction = () => {
    if (!isLoggedIn) {
      setSliderOpen(true);
      return;
    }

    startTransition(async () => {
      const { error } = await reserveWishAction(WishlistReservationFormData.fromObject({ wishId }));

      if (error) {
        if (error === "UNAUTHORIZED") {
          setSliderOpen(true);
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
      setSliderOpen(true);
      return;
    }

    startTransition(async () => {
      const { error } = await releaseWishAction(WishlistReservationFormData.fromObject({ wishId }));

      if (error) {
        if (error === "UNAUTHORIZED") {
          setSliderOpen(true);
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
      <Drawer open={isSliderOpen} onClose={() => setSliderOpen(false)} onOpenChange={open => setSliderOpen(open)}>
        <DrawerTrigger asChild></DrawerTrigger>
        <DrawerContent className="px-6 pb-4">
          <VisuallyHidden>
            <DrawerTitle>Log in to reserve a wish</DrawerTitle>
            <DrawerDescription>Log in to reserve a wish</DrawerDescription>
          </VisuallyHidden>
          <div className="pt-6">
            <SignInButton wishId={wishId} wishlistOwner={params.username} />
          </div>
          <VisuallyHidden>
            <DrawerClose>Close</DrawerClose>
          </VisuallyHidden>
        </DrawerContent>
      </Drawer>
    </>
  );
}
