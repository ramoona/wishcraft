"use client";

import { useState, useTransition } from "react";
import { updateDateOfBirthAction } from "~/services/user/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { DateOfBirthFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/toastMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";

export function OnboardingWizardDateOfBirthStep() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dateOfBirth, setDateOfBirth] = useState("");

  const trigger = () => {
    startTransition(async () => {
      const { error } = await updateDateOfBirthAction(
        DateOfBirthFormData.fromObject({ dateOfBirth, onboarding: true }),
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
      <h1>Set birthdate (optional)</h1>
      <Input
        type="date"
        name="dateOfBirth"
        placeholder="example"
        value={dateOfBirth}
        onChange={e => setDateOfBirth(e.target.value)}
      />
      <Button type="submit" size="lg">
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
