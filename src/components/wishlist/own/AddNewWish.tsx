"use client";

import { WishForm, WishFormValues } from "~/components/wishlist/own/WishForm";
import { Slider } from "~/components/ui/slider";
import { createWishAction } from "~/services/wishlist/actions";
import { WishCreationFormData } from "~/services/wishlist/formData";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "~/components/ui/button";
import * as React from "react";
import { showToastWithActionResult } from "~/core/showToastWithActionResult";
import { ShootingStar } from "@phosphor-icons/react";

export function AddNewWish() {
  const router = useRouter();
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const [isLoading, startTransition] = useTransition();

  const handleCreateWish = (values: WishFormValues) => {
    return startTransition(async () => {
      const { error } = await createWishAction(WishCreationFormData.fromObject(values));

      if (error) {
        showToastWithActionResult(error);
      }

      router.refresh();
      setIsSliderOpen(false);
    });
  };

  return (
    <div className="sticky bottom-4">
      <Button onClick={() => setIsSliderOpen(true)} size="lg" fullWidth>
        <div className="flex items-center justify-center gap-2">
          <ShootingStar size={24} />
          Make a wish
        </div>
      </Button>
      <Slider isOpen={isSliderOpen} header="Making a wish...">
        <WishForm onCancel={() => setIsSliderOpen(false)} onSubmit={handleCreateWish} isLoading={isLoading} />
      </Slider>
    </div>
  );
}
