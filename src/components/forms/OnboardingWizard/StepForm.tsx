"use client";

import React, { PropsWithChildren } from "react";

import { Button } from "~/components/ui/button";

import { useTranslation } from "react-i18next";
import { ONBOARDING_STEPS } from "~/services/user/types";
import { TypographyHeader } from "~/components/ui/typography";

export function OnboardingWizardStep({
  title,
  onSubmit,
  onSkip,
  isSubmitting,
  isSkipping,
  step,
  children,
  isSubmissionDisabled,
}: PropsWithChildren<{
  title: string;
  onSubmit: () => void;
  onSkip?: () => void;
  isSubmitting: boolean;
  isSkipping?: boolean;
  isSubmissionDisabled?: boolean;
  step: (typeof ONBOARDING_STEPS)[number];
}>) {
  const { t } = useTranslation();

  const currentStepIdx = ONBOARDING_STEPS.indexOf(step);

  return (
    <form
      action={isSubmissionDisabled ? undefined : onSubmit}
      className="grid h-full grid-rows-[auto_min-content] justify-center gap-4 px-6"
    >
      <div className="flex max-w-lg flex-col items-start gap-6 pt-4">
        <TypographyHeader>{title}</TypographyHeader>
        {children}
      </div>
      <div className="flex flex-col items-center gap-5 pb-12">
        {onSkip && (
          <Button size="lg" onClick={onSkip} variant="ghost">
            {isSkipping ? t("states.skipping") : t("actions.skip")}
          </Button>
        )}
        <Button type="submit" size="lg" disabled={isSubmissionDisabled}>
          {isSubmitting ? t("states.saving") : t("actions.continue")}
        </Button>
        <div className="mt-6 flex items-center justify-center gap-2">
          {ONBOARDING_STEPS.map((stepItem, idx) => (
            <div
              key={stepItem}
              className={`size-2 rounded-full ${idx <= currentStepIdx ? "bg-black" : "bg-gray-300"}`}
              aria-label={`Step ${idx + 1} of ${ONBOARDING_STEPS.length}`}
            />
          ))}
        </div>
      </div>
    </form>
  );
}
