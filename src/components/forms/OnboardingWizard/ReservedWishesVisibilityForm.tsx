"use client";

import React, { useState, useTransition } from "react";
import { ReservedWishesVisibilityFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/errorMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { updateReservedWishesVisibilityAction } from "~/services/user/actions";
import { Switch } from "~/components/ui/switch";
import { useTranslation } from "~/utils/useTranslation";
import { OnboardingWizardStep } from "~/components/forms/OnboardingWizard/StepForm";
import { TypographyMuted } from "~/components/ui/typography";
import { Trans } from "react-i18next";

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
        showErrorToast(getErrorMessage(error, t));
      } else {
        router.refresh();
      }
    });
  };

  return (
    <OnboardingWizardStep
      title={t("onboarding.reservedWishesVisibility.title")}
      onSubmit={trigger}
      isSubmitting={isPending}
      step="reserved-wishes-visibility"
      onSkip={() => undefined}
    >
      <Switch name="showReserved" checked={showReserved} onCheckedChange={setShowReserved} />
      <TypographyMuted>
        <Trans
          t={t}
          i18nKey="onboarding.reservedWishesVisibility.description"
          components={{
            badge: <span className="rounded-full bg-secondary px-2 text-sm text-secondary-foreground" />,
          }}
        />
      </TypographyMuted>
    </OnboardingWizardStep>
  );
}
