"use client";

import React, { useState, useTransition } from "react";
import { getErrorMessage } from "~/core/error-messages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { useTranslation, Trans } from "react-i18next";
import { OnboardingWizardStep } from "~/components/forms/OnboardingWizard/StepForm";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { processOnboardingStepAction } from "~/services/onboarding/actions";
import { ProcessOnboardingStepFormData } from "~/services/onboarding/form-data";

export function OnboardingWizardReservedWishesVisibilityStep() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showReserved, setShowReserved] = useState(false);
  const { t } = useTranslation();

  const trigger = () => {
    startTransition(async () => {
      const { error } = await processOnboardingStepAction(
        ProcessOnboardingStepFormData.fromObject({ type: "reserved-wishes-visibility", showReserved }),
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
      description={
        <Trans
          t={t}
          i18nKey="onboarding.reservedWishesVisibility.description"
          components={{
            badge: <span className="rounded-full bg-secondary px-2 text-sm text-secondary-foreground" />,
          }}
        />
      }
      isSkippable
    >
      <div className="w-full">
        <RadioGroup value={showReserved ? "yes" : "no"} onValueChange={value => setShowReserved(value === "yes")}>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes">
              <span className="font-bold">{t("general.yes")}</span>,{" "}
              <span className="font-normal">{t("onboarding.reservedWishesVisibility.showReservedOptionLabel")}</span>
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">
              <span className="font-bold">{t("general.no")}</span>,{" "}
              <span className="font-normal">{t("onboarding.reservedWishesVisibility.hideReservedOptionLabel")}</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </OnboardingWizardStep>
  );
}
