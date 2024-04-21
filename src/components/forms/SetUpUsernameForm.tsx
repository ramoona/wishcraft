"use client";

import { useFormState } from "react-dom";
import { UsernameFormState } from "~/actions/user";
import { useRouter } from "next/navigation";

export function SetUpUsernameForm({
  action,
}: {
  action: (state: UsernameFormState, formData: FormData) => Promise<UsernameFormState>;
}) {
  const [state, formAction] = useFormState(action, { error: undefined, success: undefined, username: undefined });
  const router = useRouter();

  if (state.success && state.username) {
    return (
      <div>
        <div>All set!</div>
        <button onClick={() => router.push(`/${state.username}`)}>Create my Wishlist</button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex gap-2">
      <input type="text" name="username" placeholder="example" />
      <button type="submit">Set Username</button>
      {state.error && <p>{state.error}</p>}
    </form>
  );
}
