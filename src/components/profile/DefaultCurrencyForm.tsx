import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { updateDefaultCurrencyAction } from "~/services/user/actions";
import { DefaultCurrencyFormData } from "~/services/user/form-data";
import { showErrorToast, showSuccessToast } from "~/components/ui/toasts";
import { getErrorMessage, getSuccessMessage } from "~/core/error-messages";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { currencies, getTranslatedCurrency } from "~/lib/i18n/currencies";

export function DefaultCurrencyForm({ currency: initialValue }: { currency: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currency, setCurrency] = useState(initialValue);
  const { t } = useTranslation();

  const trigger = (currency: string) => {
    setCurrency(currency);
    startTransition(async () => {
      const { error } = await updateDefaultCurrencyAction(DefaultCurrencyFormData.fromObject({ currency }));
      if (error) {
        showErrorToast(getErrorMessage(error, t));
      } else {
        showSuccessToast(getSuccessMessage("SAVED", t));
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="pl-2">{t("profile.preferredCurrency")}</Label>
      <Select
        value={currency}
        onChange={trigger}
        disabled={isPending}
        placeholder="Select currency"
        options={currencies.map(currency => ({ value: currency, label: getTranslatedCurrency(currency, t) }))}
      />
    </div>
  );
}
