"use client";

import React, { useState, useTransition } from "react";
import { getErrorMessage } from "~/core/errorMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { OnboardingWizardStep } from "~/components/forms/OnboardingWizard/StepForm";
import { TypographyMuted } from "~/components/ui/typography";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { processOnboardingStepAction } from "~/services/onboarding/actions";
import { ProcessOnboardingStepFormData } from "~/services/onboarding/formData";

export function OnboardingWizardProfileVisibilityStep() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isProfileHidden, setIsProfileHidden] = useState(false);
  const { t } = useTranslation();

  const trigger = () => {
    startTransition(async () => {
      const { error } = await processOnboardingStepAction(
        ProcessOnboardingStepFormData.fromObject({ type: "profile-visibility", isProfileHidden }),
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
      onSubmit={trigger}
      step="profile-visibility"
      title={t("onboarding.profileVisibility.title")}
      isSubmitting={isPending}
      isSkippable
    >
      <div className="w-full">
        <RadioGroup
          value={isProfileHidden ? "private" : "public"}
          onValueChange={value => setIsProfileHidden(value === "private")}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="publice">
              <span className="font-bold">{t("general.yes")}</span>
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private">
              <span className="font-bold">{t("general.no")}</span>,{" "}
              <span className="font-normal">{t("onboarding.profileVisibility.privateProfileOptionLabel")}</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      <TypographyMuted>{t("onboarding.profileVisibility.description")}</TypographyMuted>
    </OnboardingWizardStep>
  );
}
