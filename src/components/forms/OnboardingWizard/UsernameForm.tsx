"use client";

import { useState, useTransition } from "react";
import { updateUsernameAction } from "~/services/user/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { UsernameFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/toastMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";

export function OnboardingWizardUsernameStep({ initialUsername }: { initialUsername: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState(initialUsername);

  const trigger = () => {
    startTransition(async () => {
      const { error } = await updateUsernameAction(UsernameFormData.fromObject({ username, onboarding: true }));
      if (error) {
        showErrorToast(getErrorMessage(error));
      } else {
        router.refresh();
      }
    });
  };

  return (
    <form action={trigger} className="flex flex-col items-center gap-4 p-4">
      <h1>Set username</h1>
      <Input
        type="text"
        name="username"
        placeholder="e.g. macro-data-refiner"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <Button type="submit" size="lg">
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
