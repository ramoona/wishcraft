"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { finalizeSignUpAction } from "~/actions/user";
import { SignUpFormData } from "~/actions/formData";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function SetUpUsernameForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [username, setUsername] = useState("");

  const triggerFinalizeSignUpFormAction = () => {
    startTransition(async () => {
      const { error } = await finalizeSignUpAction(SignUpFormData.fromObject({ username }));
      if (error) {
        setError(error);
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
      <Button type="submit">{isPending ? "Setting username..." : "Set Username"}</Button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
