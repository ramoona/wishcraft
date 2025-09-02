import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { updateDateOfBirthAction } from "~/services/user/actions";
import { DateOfBirthFormData } from "~/services/user/form-data";
import { showErrorToast, showSuccessToast } from "~/components/ui/toasts";
import { getErrorMessage, getSuccessMessage } from "~/core/error-messages";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { getTranslatedMonth } from "~/lib/i18n/months";
import { DAYS_IN_MONTHS } from "~/core/consts";

export function DateOfBirthForm({ day: initialDay, month: initialMonth }: { day?: number; month?: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [day, setDay] = useState<number | undefined>(initialDay);
  const [month, setMonth] = useState<number | undefined>(initialMonth);
  const { t } = useTranslation();

  const trigger = ({ day, month }: { day: number; month: number }) => {
    startTransition(async () => {
      const { error } = await updateDateOfBirthAction(
        DateOfBirthFormData.fromObject({ dayOfBirth: day, monthOfBirth: month }),
      );
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
      <Label className="pl-2">{t("profile.birthday")}</Label>
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
          disabled={isPending}
        />
        <Select
          key={month}
          value={day ? String(day) : ""}
          placeholder={t("placeholders.selectDay")}
          disabled={!month || isPending}
          onChange={day => {
            setDay(parseInt(day));

            if (month) {
              trigger({ month, day: parseInt(day) });
            }
          }}
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
    </div>
  );
}
