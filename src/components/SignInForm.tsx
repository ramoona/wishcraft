"use client";

import { useSession, signIn } from "next-auth/react";

export function SignInForm() {
  const { status } = useSession();

  return (
    <div>
      <button
        onClick={async () => {
          await signIn("google");
        }}
      >
        {status === "loading" ? "Checking session..." : "Sign in with Google"}
      </button>
    </div>
  );
}
