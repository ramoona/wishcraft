"use client";

import React, { useState, useTransition } from "react";
import { Button } from "~/components/ui/button";
import { ProfileVisibilityFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/toastMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { updateProfileVisibilityAction } from "~/services/user/actions";
import { Switch } from "~/components/ui/switch";

export function OnboardingWizardProfileVisibilityStep() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isProfileHidden, setIsProfileHidden] = useState(false);

  const trigger = () => {
    startTransition(async () => {
      const { error } = await updateProfileVisibilityAction(
        ProfileVisibilityFormData.fromObject({ isProfileHidden, onboarding: true }),
      );
      if (error) {
        showErrorToast(getErrorMessage(error));
      } else {
        router.refresh();
      }
    });
  };

  return (
    <form action={trigger} className="flex flex-col items-center gap-4 p-4">
      <h1>Do you want your profile to be private?</h1>
      <Switch name="isProfileHidden" checked={isProfileHidden} onCheckedChange={setIsProfileHidden} />
      <Button type="submit" size="lg">
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
