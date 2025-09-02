import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { SupportedLanguages } from "~/lib/i18n/settings";
import { updateLanguageAction } from "~/services/user/actions";
import { LanguageFormData } from "~/services/user/form-data";
import { showErrorToast, showSuccessToast } from "~/components/ui/toasts";
import { getErrorMessage, getSuccessMessage } from "~/core/error-messages";
import { Label } from "~/components/ui/label";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import React from "react";

export function PreferredLanguageForm({
  hideLabel = false,
  noSuccessToast = false,
  filled,
}: {
  hideLabel?: boolean;
  noSuccessToast?: boolean;
  filled?: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const trigger = async (value: SupportedLanguages) => {
    const { error } = await updateLanguageAction(LanguageFormData.fromObject({ language: value }));
    if (error) {
      showErrorToast(getErrorMessage(error, t));
    } else {
      if (!noSuccessToast) {
        showSuccessToast(getSuccessMessage("SAVED", t));
      }

      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {!hideLabel && <Label className="pl-2">{t("profile.preferredLanguage")}</Label>}
      <LanguageSwitcher onChange={trigger} filled={filled} />
    </div>
  );
}
