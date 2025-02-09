"use client";

import React, { useState, useTransition } from "react";
import { Button } from "~/components/ui/button";
import { ReservedWishesVisibilityFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/toastMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { updateReservedWishesVisibilityAction } from "~/services/user/actions";
import { Input } from "~/components/ui/input";

export function OnboardingWizardReservedWishesVisibilityStep() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showReserved, setShowReserved] = useState(true);

  const trigger = () => {
    startTransition(async () => {
      const { error } = await updateReservedWishesVisibilityAction(
        ReservedWishesVisibilityFormData.fromObject({ showReserved, onboarding: true }),
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
      <h1>Do you want to see if your wishes are reserved by someone?</h1>
      <Input
        type="checkbox"
        name="showReserved"
        checked={showReserved}
        onChange={e => setShowReserved(e.target.checked)}
      />
      <Button type="submit" size="lg">
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
