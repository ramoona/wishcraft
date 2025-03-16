"use client";

import React, { useState, useTransition } from "react";
import { updateDateOfBirthAction } from "~/services/user/actions";
import { DateOfBirthFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/errorMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { Select } from "~/components/ui/select";
import { DAYS_IN_MONTHS, MONTHS } from "~/core/consts";
import { useTranslation } from "~/utils/useTranslation";
import { OnboardingWizardStep } from "~/components/forms/OnboardingWizard/StepForm";
import { TypographyMuted } from "~/components/ui/typography";

export function OnboardingWizardDateOfBirthStep() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [day, setDay] = useState<number>();
  const [month, setMonth] = useState<number>();
  const { t } = useTranslation();

  const trigger = () => {
    startTransition(async () => {
      const { error } = await updateDateOfBirthAction(
        DateOfBirthFormData.fromObject({ dayOfBirth: day!, monthOfBirth: month!, onboarding: true }),
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
      onSkip={() => undefined}
      isSubmissionDisabled={!!month && !day}
    >
      <div className="grid w-full grid-cols-2 gap-4">
        <Select
          value={month ? String(month) : ""}
          placeholder={t("placeholders.selectMonth")}
          onChange={month => {
            setMonth(parseInt(month));
            setDay(undefined);
          }}
          options={Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: MONTHS[i] }))}
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
      <TypographyMuted>{t("onboarding.dateOfBirth.description")}</TypographyMuted>
    </OnboardingWizardStep>
  );
}
