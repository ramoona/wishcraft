"use client";

import { buttonVariants } from "~/components/ui/button";
import { GoogleLogo } from "@phosphor-icons/react";

import { cn } from "~/utils/classnames";

export function SignInForm({ wishlistOwner, wishId }: { wishlistOwner?: string; wishId?: string }) {
  const queryParams = new URLSearchParams();

  if (wishlistOwner) {
    queryParams.append("wishlistOwner", wishlistOwner);
  }

  if (wishId) {
    queryParams.append("wishId", wishId);
  }

  return (
    <a
      className={cn(buttonVariants({ variant: "outline" }), "flex h-12 items-center gap-2 no-underline")}
      href={`/api/auth/google?${queryParams.toString()}`}
    >
      <GoogleLogo size={24} weight="regular" />
      {"Sign in with Google"}
    </a>
  );
}
