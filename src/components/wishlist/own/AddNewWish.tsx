"use client";

import { WishForm, WishFormValues } from "~/components/wishlist/own/WishForm";
import { Slider } from "~/components/ui/slider";
import { createWishAction } from "~/services/wishlist/actions";
import { WishCreationFormData } from "~/services/wishlist/formData";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import * as React from "react";
import { showToastWithActionResult } from "~/core/showToastWithActionResult";

export function AddNewWish() {
  const router = useRouter();
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const handleCreateWish = async (values: WishFormValues) => {
    const { error } = await createWishAction(WishCreationFormData.fromObject(values));

    if (error) {
      showToastWithActionResult(error);
    }

    router.refresh();
    setIsSliderOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setIsSliderOpen(true)} size="sm" variant="outline">
        Make a wish
      </Button>
      <Slider isOpen={isSliderOpen} header="Making a wish...">
        <WishForm onCancel={() => setIsSliderOpen(false)} onSubmit={handleCreateWish} />
      </Slider>
    </div>
  );
}
