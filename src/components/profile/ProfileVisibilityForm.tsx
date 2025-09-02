import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { Trans, useTranslation } from "react-i18next";
import { updateProfileVisibilityAction } from "~/services/user/actions";
import { ProfileVisibilityFormData } from "~/services/user/form-data";
import { showErrorToast, showSuccessToast } from "~/components/ui/toasts";
import { getErrorMessage, getSuccessMessage } from "~/core/error-messages";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

export function ProfileVisibilityForm({ isProfileHidden: initialValue }: { isProfileHidden?: boolean | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isProfileHidden, setIsProfileHidden] = useState(initialValue ?? false);
  const { t } = useTranslation();

  const trigger = (value: boolean) => {
    setIsProfileHidden(value);
    startTransition(async () => {
      const { error } = await updateProfileVisibilityAction(
        ProfileVisibilityFormData.fromObject({ isProfileHidden: value }),
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
        <Label className="pl-2">{t("profile.privateWishlist")}</Label>
        <div className="pl-2 text-xs text-foreground/60">
          {isProfileHidden ? (
            <Trans
              t={t}
              i18nKey="profile.publicWishlistEnabled"
              components={{ bold: <span className="font-semibold" /> }}
            />
          ) : (
            <Trans
              t={t}
              i18nKey="profile.publicWishlistDisabled"
              components={{ bold: <span className="font-semibold" /> }}
            />
          )}
        </div>
      </div>
      <Switch checked={isProfileHidden ?? false} onCheckedChange={trigger} disabled={isPending} />
    </div>
  );
}
