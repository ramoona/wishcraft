import { createWishAction, deleteWishAction, updateWishAction } from "~/services/wishlist/actions";
import { WishCreationFormData, WishDeletionFormData, WishUpdateFormData } from "~/services/wishlist/formData";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { WishCreateInput, WishUpdateInput } from "~/services/wishlist/types";
import { showErrorToast } from "~/components/ui/toasts";
import { useTranslation } from "~/utils/useTranslation";
import { getErrorMessage } from "~/core/errorMessages";

export function useDeleteWish(): [boolean, (id: string, onSuccess?: () => void) => void] {
  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();
  const { t } = useTranslation();

  const trigger = (id: string, onSuccess?: () => void) => {
    startDeleteTransition(async () => {
      const { error } = await deleteWishAction(WishDeletionFormData.fromObject({ id }));
      if (error) {
        showErrorToast(getErrorMessage(error, t));
      }
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
  const { t } = useTranslation();

  const trigger = (id: string, input: Omit<WishUpdateInput, "id">, onSuccess?: () => void) => {
    if (!id) {
      return;
    }
    startUpdateTransition(async () => {
      const { error } = await updateWishAction(WishUpdateFormData.fromObject({ id, ...input }));
      if (error) {
        showErrorToast(getErrorMessage(error, t));
      }
      onSuccess?.();
      router.refresh();
    });
  };

  return [isUpdating, trigger];
}

export function useCreateWish(): [boolean, (input: WishCreateInput, onSuccess?: () => void) => void] {
  const router = useRouter();
  const [isUpdating, startUpdateTransition] = useTransition();
  const { t } = useTranslation();

  const trigger = (input: WishCreateInput, onSuccess?: () => void) => {
    startUpdateTransition(async () => {
      const { error } = await createWishAction(WishCreationFormData.fromObject(input));
      if (error) {
        showErrorToast(getErrorMessage(error, t));
      }
      onSuccess?.();
      router.refresh();
    });
  };

  return [isUpdating, trigger];
}
