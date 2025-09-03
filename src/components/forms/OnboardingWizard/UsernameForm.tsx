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
import { isValidUsername } from "~/utils/username";

export function OnboardingWizardUsernameStep({ username: initialUsername }: { username: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [username, setUsername] = useState(initialUsername);
  const [isUnique, setIsUnique] = useState<boolean | undefined>(true);
  const [isValid, setIsValid] = useState<boolean | undefined>(true);

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

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toLowerCase();
    const valid = isValidUsername(value);

    setUsername(value);
    setIsValid(valid);
  };

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
      isSubmissionDisabled={!username || !isUnique || !isValid}
    >
      <div className="w-full">
        <Input
          type="text"
          name="username"
          placeholder={t("placeholders.username")}
          value={username}
          onChange={handleUsernameChange}
          className={clsx(
            ((username && !isUnique) || !isValid) && "border-destructive/70",
            username && isUnique && isValid && "border-emerald-500",
          )}
        />
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Your username must:</p>
          <ul className="list-disc pl-4">
            <li>Be 2–40 characters long</li>
            <li>Start with a letter</li>
            <li>Use only letters, numbers, and hyphens</li>
            <li>Not have “--” in a row</li>
          </ul>
        </div>
      </div>
    </OnboardingWizardStep>
  );
}
