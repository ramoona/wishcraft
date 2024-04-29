"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { finalizeSignUpFormAction } from "~/actions/user";
import { SignUpFormData } from "~/actions/formData";

export function SetUpUsernameForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [username, setUsername] = useState("");

  const triggerFinalizeSignUpFormAction = () => {
    startTransition(async () => {
      const { error } = await finalizeSignUpFormAction(SignUpFormData.fromObject({ username }));
      if (error) {
        setError(error);
      } else {
        router.push(`/${username}`);
      }
    });
  };

  return (
    <form action={triggerFinalizeSignUpFormAction} className="flex gap-2">
      <input
        type="text"
        name="username"
        placeholder="example"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button type="submit">{isPending ? "Setting username..." : "Set Username"}</button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
