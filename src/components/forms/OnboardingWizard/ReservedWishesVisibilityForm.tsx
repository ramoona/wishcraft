"use client";

import React, { useState, useTransition } from "react";
import { Button } from "~/components/ui/button";
import { ReservedWishesVisibilityFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/toastMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { updateReservedWishesVisibilityAction } from "~/services/user/actions";
import { Switch } from "~/components/ui/switch";
import { useTranslation } from "~/utils/useTranslation";

export function OnboardingWizardReservedWishesVisibilityStep() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showReserved, setShowReserved] = useState(false);
  const { t } = useTranslation();

  const trigger = () => {
    startTransition(async () => {
      const { error } = await updateReservedWishesVisibilityAction(
        ReservedWishesVisibilityFormData.fromObject({ showReserved, onboarding: true }),
      );
      if (error) {
        showErrorToast(getErrorMessage(error));
      } else {
        router.refresh();
      }
    });
  };

  return (
    <form action={trigger} className="flex flex-col items-center gap-4 p-4">
      <h1>{t("onboarding.reservedWishesVisibility.title")}</h1>
      <Switch name="showReserved" checked={showReserved} onCheckedChange={setShowReserved} />
      <Button type="submit" size="lg">
        {isPending ? t("states.saving") : t("actions.save")}
      </Button>
    </form>
  );
}
