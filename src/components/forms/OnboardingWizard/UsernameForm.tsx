"use client";

import React, { useCallback, useDeferredValue, useEffect, useState, useTransition } from "react";
import { checkUsernameUniquenessAction } from "~/services/user/actions";
import { Input } from "~/components/ui/input";
import { UsernameFormData } from "~/services/user/form-data";
import { getErrorMessage } from "~/core/error-messages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { OnboardingWizardStep } from "~/components/forms/OnboardingWizard/StepForm";
import { processOnboardingStepAction } from "~/services/onboarding/actions";
import { ProcessOnboardingStepFormData } from "~/services/onboarding/form-data";

export function OnboardingWizardUsernameStep() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [username, setUsername] = useState("");
  const [isUnique, setIsUnique] = useState<boolean | undefined>(true);
  const { t } = useTranslation();

  const deferredValue = useDeferredValue(username);

  const trigger = () => {
    if (username && isUnique) {
      startTransition(async () => {
        const { error } = await processOnboardingStepAction(
          ProcessOnboardingStepFormData.fromObject({ type: "username", username }),
        );
        if (error) {
          showErrorToast(getErrorMessage(error, t));
        } else {
          router.refresh();
        }
      });
    } else {
      if (!username) {
        showErrorToast(getErrorMessage("INPUT_IS_REQUIRED", t));
      } else if (!isUnique) {
        showErrorToast(getErrorMessage("USERNAME_IS_TAKEN", t));
      } else {
        showErrorToast(getErrorMessage("UNKNOWN", t));
      }
    }
  };

  const checkUniqueness = useCallback(
    async (username: string) => {
      const { error, isUnique } = await checkUsernameUniquenessAction(UsernameFormData.fromObject({ username }));
      if (error) {
        showErrorToast(getErrorMessage(error, t));
      } else {
        setIsUnique(isUnique);
      }
    },
    [t],
  );

  useEffect(() => {
    if (deferredValue) {
      void checkUniqueness(deferredValue);
    }
  }, [checkUniqueness, deferredValue]);

  return (
    <OnboardingWizardStep
      step="username"
      title={t("onboarding.username.title")}
      isSubmitting={isPending}
      onSubmit={trigger}
      description={t("onboarding.username.description")}
      isSubmissionDisabled={!username || !isUnique}
    >
      <Input
        type="text"
        name="username"
        placeholder={t("placeholders.username")}
        value={username}
        onChange={e => setUsername(e.target.value)}
        className={clsx(
          username && isUnique === false && "border-destructive/70",
          username && isUnique === true && "border-emerald-500",
        )}
      />
    </OnboardingWizardStep>
  );
}
