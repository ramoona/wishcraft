import { createWishAction, deleteWishAction, updateWishAction } from "~/services/wishlist/actions";
import { WishCreationFormData, WishDeletionFormData, WishUpdateFormData } from "~/services/wishlist/form-data";
import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { WishCreateInput, WishUpdateInput } from "~/services/wishlist/types";
import { showErrorToast, showSuccessToast } from "~/components/ui/toasts";
import { useTranslation } from "react-i18next";
import { getErrorMessage, successMessages } from "~/core/error-messages";
import { processOnboardingStepAction } from "~/services/onboarding/actions";
import { ProcessOnboardingStepFormData } from "~/services/onboarding/form-data";
import Link from "next/link";
import { cn } from "~/utils/classnames";
import { buttonVariants } from "~/components/ui/button";
import * as React from "react";

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
  username: string,
  firstWish?: boolean,
): [boolean, (input: WishCreateInput, onSuccess?: () => void) => void] {
  const router = useRouter();
  const [isUpdating, startUpdateTransition] = useTransition();
  const { t } = useTranslation();

  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const isActiveWishes = segments[1] === "wishes" && segments[2] === "active";

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
      } else {
        showSuccessToast(
          t(successMessages.SAVED),
          !isActiveWishes || firstWish ? (
            <Link
              href={`/${username}/wishes/active`}
              className={cn("ml-auto no-underline", buttonVariants({ size: "sm", variant: "outline" }))}
            >
              {t("actions.viewActiveWishes")}
            </Link>
          ) : null,
        );
      }
      onSuccess?.();
      router.refresh();
    });
  };

  return [isUpdating, trigger];
}
