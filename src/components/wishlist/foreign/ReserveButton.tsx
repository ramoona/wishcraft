"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { reserveWishAction, releaseWishAction } from "~/services/wishlist/actions";
import { Button } from "~/components/ui/button";
import { SignInForm } from "~/components/forms/SignInForm";
import { Slider } from "~/components/ui/slider";
import { showToastWithActionResult } from "~/core/showToastWithActionResult";
import { WishlistReservationFormData } from "~/services/wishlist/formData";

export function ReserveButton({ wishId, isReserved }: { wishId: string; isReserved?: boolean }) {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const [isPending, startTransition] = useTransition();
  const [isSliderOpen, setSliderOpen] = useState(false);

  const triggerReserveWishAction = () => {
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

  return (
    <div>
      <Button size="xs" onClick={isReserved ? triggerReleaseWishAction : triggerReserveWishAction} variant="outline">
        {isPending && (isReserved ? "Canceling..." : "Reserving...")}
        {!isPending && (isReserved ? "Cancel" : "Reserve")}
      </Button>
      <Slider isOpen={isSliderOpen} header="Who is reserving?">
        <SignInForm wishId={wishId} wishlistOwner={params.username} />
      </Slider>
    </div>
  );
}
