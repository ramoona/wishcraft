"use client";

import React, { PropsWithChildren, ReactNode, useTransition } from "react";

import { Button } from "~/components/ui/button";

import { useTranslation } from "react-i18next";
import { ONBOARDING_STEPS } from "~/services/user/types";
import { TypographyHeader, TypographyMuted } from "~/components/ui/typography";
import { useRouter } from "next/navigation";
import { skipOnboardingStepAction } from "~/services/onboarding/actions";
import { SkipOnboardingStepFormData } from "~/services/onboarding/formData";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/errorMessages";
import { cn } from "~/utils/classnames";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
export function OnboardingWizardStep({
  title,
  onSubmit,
  isSubmitting,
  step,
  children,
  isSubmissionDisabled,
  isSkippable,
  description,
}: PropsWithChildren<{
  title: string;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSubmissionDisabled?: boolean;
  step: (typeof ONBOARDING_STEPS)[number];
  isSkippable?: boolean;
  description?: ReactNode;
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
        "grid h-full grid-rows-[auto_min-content_min-content] justify-center gap-4 pb-8 lg:h-[32rem] lg:pt-10",
        "lg:mx-auto lg:mt-8 lg:max-w-lg lg:grid-rows-[min-content_auto_min-content] lg:justify-start lg:rounded-xl lg:bg-background lg:px-8",
        step === "first-wish" &&
          "z-1 fixed left-0 top-0 h-dvh w-screen grid-rows-[auto_min-content] bg-primary px-11 pt-4 lg:static lg:h-[32rem] lg:w-full",
      )}
    >
      <div className="flex w-full max-w-2xl flex-col items-start gap-6 px-4 pt-4 lg:order-2 lg:w-full lg:px-0 lg:pt-0">
        <TypographyHeader>{title}</TypographyHeader>
        {description && (
          <DesktopOnly>
            <TypographyMuted>{description}</TypographyMuted>
          </DesktopOnly>
        )}
        {children}
        {description && (
          <MobileOnly>
            <TypographyMuted>{description}</TypographyMuted>
          </MobileOnly>
        )}
      </div>
      <div
        className={cn(
          "mt-auto flex flex-col items-center gap-5 lg:order-3 lg:mt-8 lg:w-full lg:flex-row lg:justify-end lg:gap-3",
          step === "first-wish" && "mb-12",
        )}
      >
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
          {isSubmitting ? t("states.saving") : step === "first-wish" ? t("actions.addWish") : t("actions.continue")}
        </Button>
      </div>
      {step !== "first-wish" && (
        <div className="mt-6 flex items-center justify-center gap-2 lg:order-1 lg:mb-4 lg:mt-0 lg:w-full lg:pl-2">
          {ONBOARDING_STEPS.map((stepItem, idx) => (
            <div
              key={stepItem}
              className={`size-2 rounded-full ${idx <= currentStepIdx ? "bg-black" : "bg-gray-300"}`}
              aria-label={`Step ${idx + 1} of ${ONBOARDING_STEPS.length}`}
            />
          ))}
        </div>
      )}
    </form>
  );
}
