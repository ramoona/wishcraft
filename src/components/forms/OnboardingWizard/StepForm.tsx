"use client";

import React, { PropsWithChildren, useTransition } from "react";

import { Button } from "~/components/ui/button";

import { useTranslation } from "react-i18next";
import { ONBOARDING_STEPS } from "~/services/user/types";
import { TypographyHeader } from "~/components/ui/typography";
import { useRouter } from "next/navigation";
import { skipOnboardingStepAction } from "~/services/onboarding/actions";
import { SkipOnboardingStepFormData } from "~/services/onboarding/formData";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/errorMessages";
import { cn } from "~/utils/classnames";

export function OnboardingWizardStep({
  title,
  onSubmit,
  isSubmitting,
  step,
  children,
  isSubmissionDisabled,
  isSkippable,
}: PropsWithChildren<{
  title: string;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSubmissionDisabled?: boolean;
  step: (typeof ONBOARDING_STEPS)[number];
  isSkippable?: boolean;
}>) {
  const { t } = useTranslation();

  const currentStepIdx = ONBOARDING_STEPS.indexOf(step);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const trigger = () => {
    startTransition(async () => {
      const { error } = await skipOnboardingStepAction(SkipOnboardingStepFormData.fromObject({ type: step }));
      if (error) {
        showErrorToast(getErrorMessage(error, t));
      } else {
        router.refresh();
      }
    });
  };

  return (
    <form
      action={isSubmissionDisabled ? undefined : onSubmit}
      className={cn(
        "grid h-full grid-rows-[auto_min-content] justify-center gap-4",
        step === "first-wish" && "z-1 fixed left-0 top-0 h-dvh w-screen bg-primary px-11 pt-4",
      )}
    >
      <div className="flex max-w-lg flex-col items-start gap-6 px-4 pt-4">
        <TypographyHeader>{title}</TypographyHeader>
        {children}
      </div>
      <div className="flex flex-col items-center gap-5 pb-12">
        {isSkippable && (
          <Button size="lg" onClick={trigger} variant="ghost">
            {isPending ? t("states.skipping") : t("actions.skip")}
          </Button>
        )}
        <Button
          type="submit"
          size="lg"
          variant={step === "first-wish" ? "secondary" : "default"}
          disabled={isSubmissionDisabled}
        >
          {isSubmitting ? t("states.saving") : t("actions.continue")}
        </Button>
        {step !== "first-wish" && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {ONBOARDING_STEPS.map((stepItem, idx) => (
              <div
                key={stepItem}
                className={`size-2 rounded-full ${idx <= currentStepIdx ? "bg-black" : "bg-gray-300"}`}
                aria-label={`Step ${idx + 1} of ${ONBOARDING_STEPS.length}`}
              />
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
