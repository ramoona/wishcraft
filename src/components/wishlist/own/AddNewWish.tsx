"use client";

import { WishForm, WishFormValues } from "~/components/wishlist/own/WishForm";
import { Slider } from "~/components/ui/slider";
import { createWishAction } from "~/actions/wishlist";
import { WishCreationFormData } from "~/actions/formData";
import { useRouter } from "next/navigation";

export function AddNewWish() {
  const router = useRouter();
  const handleCreateWish = async (values: WishFormValues, onComplete: () => void) => {
    await createWishAction(WishCreationFormData.fromObject(values));
    router.refresh();
    onComplete();
  };

  return (
    <div>
      <Slider triggerText="Make a wish" header="Making a wish...">
        {({ onClose }) => <WishForm onCancel={onClose} onSubmit={values => handleCreateWish(values, onClose)} />}
      </Slider>
    </div>
  );
}
