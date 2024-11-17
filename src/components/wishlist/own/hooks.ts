import { createWishAction, deleteWishAction, updateWishAction } from "~/services/wishlist/actions";
import { WishCreationFormData, WishDeletionFormData, WishUpdateFormData } from "~/services/wishlist/formData";
import { showToastWithActionResult } from "~/core/showToastWithActionResult";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { WishCreateInput, WishUpdateInput } from "~/services/wishlist/types";

export function useDeleteWish(): [boolean, (id: string, onSuccess?: () => void) => void] {
  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();

  const trigger = (id: string, onSuccess?: () => void) => {
    startDeleteTransition(async () => {
      const { error } = await deleteWishAction(WishDeletionFormData.fromObject({ id }));
      showToastWithActionResult(error);
      onSuccess?.();
      router.refresh();
    });
  };

  return [isDeleting, trigger];
}

export function useUpdateWish(): [
  boolean,
  (id: string, input: Omit<WishUpdateInput, "id">, onSuccess?: () => void) => void,
] {
  const router = useRouter();
  const [isUpdating, startUpdateTransition] = useTransition();

  const trigger = (id: string, input: Omit<WishUpdateInput, "id">, onSuccess?: () => void) => {
    if (!id) {
      return;
    }
    startUpdateTransition(async () => {
      const { error } = await updateWishAction(WishUpdateFormData.fromObject({ id, ...input }));
      showToastWithActionResult(error);
      onSuccess?.();
      router.refresh();
    });
  };

  return [isUpdating, trigger];
}

export function useCreateWish(): [boolean, (input: WishCreateInput, onSuccess?: () => void) => void] {
  const router = useRouter();
  const [isUpdating, startUpdateTransition] = useTransition();

  const trigger = (input: WishCreateInput, onSuccess?: () => void) => {
    startUpdateTransition(async () => {
      const { error } = await createWishAction(WishCreationFormData.fromObject(input));
      showToastWithActionResult(error);
      onSuccess?.();
      router.refresh();
    });
  };

  return [isUpdating, trigger];
}
