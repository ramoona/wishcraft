"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { finalizeSignUpAction } from "~/services/user/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { SignUpFormData } from "~/services/user/formData";
import { getErrorMessage } from "~/core/toastMessages";
import { showErrorToast } from "~/components/ui/toasts";

export function SetUpUsernameForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState("");

  const triggerFinalizeSignUpFormAction = () => {
    startTransition(async () => {
      const { error } = await finalizeSignUpAction(SignUpFormData.fromObject({ username }));
      if (error) {
        showErrorToast(getErrorMessage(error));
      } else {
        router.push(`/${username}`);
      }
    });
  };

  return (
    <form action={triggerFinalizeSignUpFormAction} className="flex gap-2">
      <Input
        type="text"
        name="username"
        placeholder="example"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <Button type="submit" size="lg">
        {isPending ? "Setting username..." : "Set Username"}
      </Button>
    </form>
  );
}
