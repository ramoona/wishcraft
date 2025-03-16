"use client";

import React, { useCallback, useDeferredValue, useEffect, useState, useTransition } from "react";
import { checkUsernameUniquenessAction, updateUsernameAction } from "~/services/user/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { UsernameFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/errorMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useTranslation } from "~/utils/useTranslation";

export function OnboardingWizardUsernameStep({ initialUsername }: { initialUsername: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [username, setUsername] = useState(initialUsername);
  const [isUnique, setIsUnique] = useState<boolean | undefined>(true);
  const { t } = useTranslation();

  const deferredValue = useDeferredValue(username);

  const trigger = () => {
    if (username && isUnique) {
      startTransition(async () => {
        const { error } = await updateUsernameAction(UsernameFormData.fromObject({ username, onboarding: true }));
        if (error) {
          showErrorToast(getErrorMessage(error, t));
        } else {
          router.refresh();
        }
      });
    } else {
      if (!username) {
        showErrorToast(getErrorMessage("INPUT_IS_REQUIRED", t));
      } else if (!isUnique) {
        showErrorToast(getErrorMessage("USERNAME_IS_TAKEN", t));
      } else {
        showErrorToast(getErrorMessage("UNKNOWN", t));
      }
    }
  };

  const checkUniqueness = useCallback(
    async (username: string) => {
      const { error, isUnique } = await checkUsernameUniquenessAction(UsernameFormData.fromObject({ username }));
      if (error) {
        showErrorToast(getErrorMessage(error, t));
      } else {
        setIsUnique(isUnique);
      }
    },
    [t],
  );

  useEffect(() => {
    if (deferredValue && deferredValue !== initialUsername) {
      void checkUniqueness(deferredValue);
    }
  }, [checkUniqueness, deferredValue, initialUsername]);

  return (
    <form action={trigger} className="flex flex-col items-center gap-4 p-4">
      <h1>{t("onboarding.username.title")}</h1>
      <Input
        type="text"
        name="username"
        placeholder={t("placeholders.username")}
        value={username}
        onChange={e => setUsername(e.target.value)}
        className={clsx(
          username && isUnique === false && "border-destructive/70",
          username && isUnique === true && "border-emerald-500",
        )}
      />
      <Button type="submit" size="lg">
        {isPending ? t("states.saving") : t("actions.save")}
      </Button>
    </form>
  );
}
