"use client";

import React, { useState, useTransition } from "react";
import { ProfileVisibilityFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/errorMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { updateProfileVisibilityAction } from "~/services/user/actions";
import { Switch } from "~/components/ui/switch";
import { useTranslation } from "~/utils/useTranslation";
import { OnboardingWizardStep } from "~/components/forms/OnboardingWizard/StepForm";
import { TypographyMuted } from "~/components/ui/typography";

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
      <Switch name="isProfileHidden" checked={isProfileHidden} onCheckedChange={setIsProfileHidden} />
      <TypographyMuted>{t("onboarding.profileVisibility.description")}</TypographyMuted>
    </OnboardingWizardStep>
  );
}
