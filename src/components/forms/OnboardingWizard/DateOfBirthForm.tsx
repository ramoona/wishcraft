"use client";

import React, { useState, useTransition } from "react";
import { updateDateOfBirthAction } from "~/services/user/actions";
import { Button } from "~/components/ui/button";
import { DateOfBirthFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/toastMessages";
import { showErrorToast } from "~/components/ui/toasts";
import { useRouter } from "next/navigation";
import { Select } from "~/components/ui/select";

export function OnboardingWizardDateOfBirthStep() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [day, setDay] = useState<number>();
  const [month, setMonth] = useState<number>();

  const trigger = () => {
    startTransition(async () => {
      const { error } = await updateDateOfBirthAction(
        DateOfBirthFormData.fromObject({ dayOfBirth: day!, monthOfBirth: month!, onboarding: true }),
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
      <h1>When is your birthday? (optional)</h1>

      <div className="grid w-full grid-cols-2 gap-4">
        <Select
          value={month ? String(month) : ""}
          placeholder={"Select month"}
          onChange={month => {
            setMonth(parseInt(month));
            setDay(undefined);
          }}
          options={Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: months[i] }))}
        />
        <Select
          value={day ? String(day) : ""}
          placeholder={"Select day"}
          disabled={!month}
          onChange={day => setDay(parseInt(day))}
          options={
            month
              ? Array.from({ length: daysInMonths[month - 1] }, (_, i) => ({ value: String(i + 1), label: `${i + 1}` }))
              : []
          }
        />
      </div>
      <Button type="submit" size="lg">
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const daysInMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
