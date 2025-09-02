import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { updateReservedWishesVisibilityAction } from "~/services/user/actions";
import { ReservedWishesVisibilityFormData } from "~/services/user/form-data";
import { showErrorToast, showSuccessToast } from "~/components/ui/toasts";
import { getErrorMessage, getSuccessMessage } from "~/core/error-messages";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

export function ReservedWishesVisibilityForm({ showReserved: initialValue }: { showReserved: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showReserved, setShowReserved] = useState(initialValue);
  const { t } = useTranslation();

  const trigger = (value: boolean) => {
    setShowReserved(value);
    startTransition(async () => {
      const { error } = await updateReservedWishesVisibilityAction(
        ReservedWishesVisibilityFormData.fromObject({ showReserved: value }),
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
    <div className="flex items-center justify-between gap-2">
      <div>
        <Label className="pl-2">{t("profile.reservationStatus")}</Label>
        <div className="pl-2 text-xs text-foreground/60">
          {showReserved ? (
            <span>{t("profile.reservationStatusEnabled")}</span>
          ) : (
            <span>{t("profile.reservationStatusDisabled")}</span>
          )}
        </div>
      </div>
      <Switch checked={showReserved ?? false} onCheckedChange={trigger} disabled={isPending} />
    </div>
  );
}
