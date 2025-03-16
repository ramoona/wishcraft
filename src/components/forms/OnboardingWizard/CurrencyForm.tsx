"use client";

import React, { useState, useTransition } from "react";
import { Button } from "~/components/ui/button";
import { DefaultCurrencyFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/errorMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { currencies, currencyNames } from "~/lib/currencies";
import { Select } from "~/components/ui/select";
import { updateDefaultCurrencyAction } from "~/services/user/actions";
import { useTranslation } from "~/utils/useTranslation";

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
    <form action={trigger} className="flex flex-col items-center gap-4 p-4">
      <h1>{t("onboarding.defaultCurrency.title")}</h1>
      <Select
        value={currency}
        onChange={setCurrency}
        options={currencies.map(currency => ({ value: currency, label: currencyNames[currency] }))}
      />
      <Button type="submit" size="lg">
        {isPending ? t("states.saving") : t("actions.save")}
      </Button>
    </form>
  );
}
