"use client";

import React, { useState, useTransition } from "react";
import { getErrorMessage } from "~/core/errorMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { Select } from "~/components/ui/select";
import { DAYS_IN_MONTHS } from "~/core/consts";
import { useTranslation } from "react-i18next";
import { OnboardingWizardStep } from "~/components/forms/OnboardingWizard/StepForm";
import { processOnboardingStepAction } from "~/services/onboarding/actions";
import { ProcessOnboardingStepFormData } from "~/services/onboarding/form-data";
import { getTranslatedMonth } from "~/lib/i18n/months";

export function OnboardingWizardDateOfBirthStep() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [day, setDay] = useState<number>();
  const [month, setMonth] = useState<number>();
  const { t } = useTranslation();

  const trigger = () => {
    startTransition(async () => {
      const { error } = await processOnboardingStepAction(
        ProcessOnboardingStepFormData.fromObject({ type: "date-of-birth", dayOfBirth: day!, monthOfBirth: month! }),
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
      step="date-of-birth"
      isSubmitting={isPending}
      title={t("onboarding.dateOfBirth.title")}
      isSubmissionDisabled={!!month && !day}
      description={t("onboarding.dateOfBirth.description")}
      isSkippable
    >
      <div className="grid w-full grid-cols-2 gap-4">
        <Select
          value={month ? String(month) : ""}
          placeholder={t("placeholders.selectMonth")}
          onChange={month => {
            setMonth(parseInt(month));
            setDay(undefined);
          }}
          options={Array.from({ length: 12 }, (_, i) => ({
            value: String(i + 1),
            label: getTranslatedMonth(i + 1, t),
          }))}
        />
        <Select
          value={day ? String(day) : ""}
          placeholder={t("placeholders.selectDay")}
          disabled={!month}
          onChange={day => setDay(parseInt(day))}
          options={
            month
              ? Array.from({ length: DAYS_IN_MONTHS[month - 1] }, (_, i) => ({
                  value: String(i + 1),
                  label: `${i + 1}`,
                }))
              : []
          }
        />
      </div>
    </OnboardingWizardStep>
  );
}
