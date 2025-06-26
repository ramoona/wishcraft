"use client";

import React, { useState, useTransition } from "react";
import { getErrorMessage } from "~/core/errorMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { currencies, getTranslatedCurrency } from "~/lib/i18n/currencies";
import { Select } from "~/components/ui/select";
import { useTranslation } from "react-i18next";
import { OnboardingWizardStep } from "~/components/forms/OnboardingWizard/StepForm";
import { processOnboardingStepAction } from "~/services/onboarding/actions";
import { ProcessOnboardingStepFormData } from "~/services/onboarding/formData";

export function OnboardingWizardCurrencyStep() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currency, setCurrency] = useState("EUR");
  const { t } = useTranslation();

  const trigger = () => {
    startTransition(async () => {
      const { error } = await processOnboardingStepAction(
        ProcessOnboardingStepFormData.fromObject({ type: "default-currency", currency }),
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
      title={t("onboarding.defaultCurrency.title")}
      step="default-currency"
      onSubmit={trigger}
      isSubmitting={isPending}
      description={t("onboarding.defaultCurrency.description")}
      isSkippable
    >
      <Select
        value={currency}
        onChange={setCurrency}
        options={currencies.map(currency => ({ value: currency, label: getTranslatedCurrency(currency, t) }))}
      />
    </OnboardingWizardStep>
  );
}
