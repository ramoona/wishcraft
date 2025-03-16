"use client";

import React, { useState, useTransition } from "react";
import { ProfileVisibilityFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/errorMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { updateProfileVisibilityAction } from "~/services/user/actions";
import { useTranslation } from "~/utils/useTranslation";
import { OnboardingWizardStep } from "~/components/forms/OnboardingWizard/StepForm";
import { TypographyMuted } from "~/components/ui/typography";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

export function OnboardingWizardProfileVisibilityStep() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isProfileHidden, setIsProfileHidden] = useState(false);
  const { t } = useTranslation();

  const trigger = () => {
    startTransition(async () => {
      const { error } = await updateProfileVisibilityAction(
        ProfileVisibilityFormData.fromObject({ isProfileHidden, onboarding: true }),
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
      onSkip={() => undefined}
      step="profile-visibility"
      title={t("onboarding.profileVisibility.title")}
      isSubmitting={isPending}
    >
      <div className="w-full">
        <RadioGroup
          value={isProfileHidden ? "private" : "public"}
          onValueChange={value => setIsProfileHidden(value === "private")}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="publice">
              <span className="font-bold">Yes</span>
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private">
              <span className="font-bold">No</span>,{" "}
              <span className="font-normal">I want my wishlist to be private</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      <TypographyMuted>{t("onboarding.profileVisibility.description")}</TypographyMuted>
    </OnboardingWizardStep>
  );
}
