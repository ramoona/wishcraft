"use client";

import React, { useState, useTransition } from "react";
import { DefaultCurrencyFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/errorMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { currencies, currencyNames } from "~/lib/currencies";
import { Select } from "~/components/ui/select";
import { updateDefaultCurrencyAction } from "~/services/user/actions";
import { useTranslation } from "react-i18next";
import { OnboardingWizardStep } from "~/components/forms/OnboardingWizard/StepForm";
import { TypographyMuted } from "~/components/ui/typography";

export function OnboardingWizardCurrencyStep() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currency, setCurrency] = useState("EUR");
  const { t } = useTranslation();

  const trigger = () => {
    startTransition(async () => {
      const { error } = await updateDefaultCurrencyAction(
        DefaultCurrencyFormData.fromObject({ currency, onboarding: true }),
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
      onSkip={() => undefined}
    >
      <Select
        value={currency}
        onChange={setCurrency}
        options={currencies.map(currency => ({ value: currency, label: currencyNames[currency] }))}
      />
      <TypographyMuted>{t("onboarding.defaultCurrency.description")}</TypographyMuted>
    </OnboardingWizardStep>
  );
}
