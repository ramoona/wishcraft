"use client";

import { useDeferredValue, useEffect, useState, useTransition } from "react";
import { checkUsernameUniquenessAction, updateUsernameAction } from "~/services/user/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { UsernameFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/toastMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

export function OnboardingWizardUsernameStep({ initialUsername }: { initialUsername: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [username, setUsername] = useState(initialUsername);
  const [isUnique, setIsUnique] = useState<boolean | undefined>(true);

  const deferredValue = useDeferredValue(username);

  const trigger = () => {
    if (username && isUnique) {
      startTransition(async () => {
        const { error } = await updateUsernameAction(UsernameFormData.fromObject({ username, onboarding: true }));
        if (error) {
          showErrorToast(getErrorMessage(error));
        } else {
          router.refresh();
        }
      });
    } else {
      if (!username) {
        showErrorToast("Username is required");
      } else if (!isUnique) {
        showErrorToast("Username is already taken");
      }
    }
  };

  const checkUniqueness = async (username: string) => {
    const { error, isUnique } = await checkUsernameUniquenessAction(UsernameFormData.fromObject({ username }));
    if (error) {
      showErrorToast(getErrorMessage(error));
    } else {
      setIsUnique(isUnique);
    }
  };

  useEffect(() => {
    if (deferredValue && deferredValue !== initialUsername) {
      void checkUniqueness(deferredValue);
    }
  }, [deferredValue, initialUsername]);

  return (
    <form action={trigger} className="flex flex-col items-center gap-4 p-4">
      <h1>Set username</h1>
      <Input
        type="text"
        name="username"
        placeholder="e.g. macro-data-refiner"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className={clsx(
          username && isUnique === false && "border-destructive/70",
          username && isUnique === true && "border-emerald-500",
        )}
      />
      <Button type="submit" size="lg">
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
