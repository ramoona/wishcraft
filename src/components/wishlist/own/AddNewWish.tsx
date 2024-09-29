"use client";

import { WishForm, WishFormValues } from "~/components/wishlist/own/WishForm";
import { Slider } from "~/components/ui/slider";
import { createWishAction } from "~/actions/wishlist";
import { WishCreationFormData } from "~/actions/formData";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import * as React from "react";

export function AddNewWish() {
  const router = useRouter();
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const handleCreateWish = async (values: WishFormValues) => {
    await createWishAction(WishCreationFormData.fromObject(values));
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
