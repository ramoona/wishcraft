"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { reserveWishAction, releaseWishAction } from "~/services/wishlist/actions";
import { Button } from "~/components/ui/button";
import { SignInForm } from "~/components/forms/SignInForm";
import { Slider } from "~/components/ui/slider";
import { showToastWithActionResult } from "~/core/showToastWithActionResult";
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

export function ReserveButton({
  wishId,
  isReserved,
  isMobile,
  isLoggedIn,
}: {
  wishId: string;
  isReserved?: boolean;
  isMobile: boolean;
  isLoggedIn?: boolean;
}) {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const [isPending, startTransition] = useTransition();
  const [isSliderOpen, setSliderOpen] = useState(false);

  const triggerReserveWishAction = () => {
    if (!isLoggedIn) {
      setSliderOpen(true);
      return;
    }

    startTransition(async () => {
      const { error } = await reserveWishAction(WishlistReservationFormData.fromObject({ wishId }));

      if (error === "UNAUTHORIZED") {
        setSliderOpen(true);
        return;
      }

      showToastWithActionResult(error);
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

      if (error === "UNAUTHORIZED") {
        setSliderOpen(true);
        return;
      }

      showToastWithActionResult(error);
      router.refresh();
    });
  };

  if (isMobile) {
    return (
      <>
        <Button onClick={isReserved ? triggerReleaseWishAction : triggerReserveWishAction} variant="outline">
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
            <SignInForm wishId={wishId} wishlistOwner={params.username} />
            <VisuallyHidden>
              <DrawerClose>Close</DrawerClose>
            </VisuallyHidden>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      <Button onClick={isReserved ? triggerReleaseWishAction : triggerReserveWishAction} variant="outline">
        {isPending && (isReserved ? "Canceling..." : "Reserving...")}
        {!isPending && (isReserved ? "Cancel reservation" : "Reserve")}
      </Button>

      <Slider isOpen={isSliderOpen} header="Who is reserving?">
        <SignInForm wishId={wishId} wishlistOwner={params.username} />
      </Slider>
    </>
  );
}
