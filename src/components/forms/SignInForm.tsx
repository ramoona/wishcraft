"use client";

import { useSession, signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";

export function SignInForm() {
  const { status } = useSession();

  return (
    <Button onClick={async () => await signIn("google")}>
      {status === "loading" ? "Checking session..." : "Sign in with Google"}
    </Button>
  );
}
