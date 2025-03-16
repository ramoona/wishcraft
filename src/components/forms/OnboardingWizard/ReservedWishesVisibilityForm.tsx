"use client";

import React, { useState, useTransition } from "react";
import { ReservedWishesVisibilityFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/errorMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { updateReservedWishesVisibilityAction } from "~/services/user/actions";
import { useTranslation } from "~/utils/useTranslation";
import { OnboardingWizardStep } from "~/components/forms/OnboardingWizard/StepForm";
import { TypographyMuted } from "~/components/ui/typography";
import { Trans } from "react-i18next";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";

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
      <div className="w-full">
        <RadioGroup value={showReserved ? "yes" : "no"} onValueChange={value => setShowReserved(value === "yes")}>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes">
              <span className="font-bold">Yes</span>, <span className="font-normal">I&#39;m curious</span>
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">
              <span className="font-bold">No</span>, <span className="font-normal">I like surprises</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

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
