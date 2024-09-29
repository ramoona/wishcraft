"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { reserveWishAction } from "~/actions/wishlist";
import { Button } from "~/components/ui/button";

export function ReserveButton({ wishId }: { wishId: string }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  const triggerReserveWishAction = () => {
    const formData = new FormData();
    formData.append("wishId", wishId);

    startTransition(async () => {
      const { error } = await reserveWishAction(formData);
      if (error) {
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
    </div>
  );
}
