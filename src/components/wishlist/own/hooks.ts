import { createWishAction, deleteWishAction, updateWishAction } from "~/services/wishlist/actions";
import { WishCreationFormData, WishDeletionFormData, WishUpdateFormData } from "~/services/wishlist/formData";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { WishCreateInput, WishUpdateInput } from "~/services/wishlist/types";
import { showErrorToast } from "~/components/ui/toasts";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "~/core/errorMessages";
import { processOnboardingStepAction } from "~/services/onboarding/actions";
import { ProcessOnboardingStepFormData } from "~/services/onboarding/formData";

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

export function useCreateWish(
  firstWish?: boolean,
): [boolean, (input: WishCreateInput, onSuccess?: () => void) => void] {
  const router = useRouter();
  const [isUpdating, startUpdateTransition] = useTransition();
  const { t } = useTranslation();

  const trigger = (input: WishCreateInput, onSuccess?: () => void) => {
    startUpdateTransition(async () => {
      const { error: createError } = await createWishAction(WishCreationFormData.fromObject(input));

      let onboardingStepError;
      if (firstWish) {
        const result = await processOnboardingStepAction(
          ProcessOnboardingStepFormData.fromObject({ type: "first-wish" }),
        );
        if (result.error) {
          onboardingStepError = result.error;
        }
      }

      const error = createError || onboardingStepError;

      if (error) {
        showErrorToast(getErrorMessage(error, t));
      }
      onSuccess?.();
      router.refresh();
    });
  };

  return [isUpdating, trigger];
}
