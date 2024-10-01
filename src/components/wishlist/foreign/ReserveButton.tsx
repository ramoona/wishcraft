"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { reserveWishAction } from "~/actions/wishlist";
import { Button } from "~/components/ui/button";
import { SignInForm } from "~/components/forms/SignInForm";
import { Slider } from "~/components/ui/slider";

export function ReserveButton({ wishId }: { wishId: string }) {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const [isPending, startTransition] = useTransition();
  const [isSliderOpen, setSliderOpen] = useState(false);
  const [error, setError] = useState<string>();

  const triggerReserveWishAction = () => {
    const formData = new FormData();
    formData.append("wishId", wishId);

    startTransition(async () => {
      const { error } = await reserveWishAction(formData);
      if (error && error === "UNAUTHORIZED") {
        setSliderOpen(true);
      } else if (error) {
        setError(error);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div>
      <Button size="xs" onClick={triggerReserveWishAction} variant="outline">
        {isPending ? "Reserving..." : "Reserve"}
      </Button>
      <span>{error}</span>
      <Slider isOpen={isSliderOpen} header="Who is reserving?">
        <SignInForm wishId={wishId} wishlistOwner={params.username} />
      </Slider>
    </div>
  );
}
