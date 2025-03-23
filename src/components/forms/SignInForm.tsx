"use client";

import { buttonVariants } from "~/components/ui/button";

import { cn } from "~/utils/classnames";
// import { useTranslation } from "react-i18next";
import { TypographyExtraLargeHeader, TypographyLeadBody } from "~/components/ui/typography";

export function SignInForm({ wishlistOwner, wishId }: { wishlistOwner?: string; wishId?: string }) {
  const queryParams = new URLSearchParams();
  // const { t } = useTranslation();

  if (wishlistOwner) {
    queryParams.append("wishlistOwner", wishlistOwner);
  }

  if (wishId) {
    queryParams.append("wishId", wishId);
  }

  return (
    <div className="flex flex-col items-center gap-6 px-11 pb-28">
      <div className="flex flex-col gap-2">
        <TypographyExtraLargeHeader>Make your wishes come true!</TypographyExtraLargeHeader>
        <TypographyLeadBody>
          The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
        </TypographyLeadBody>
      </div>
      <a
        className={cn(
          buttonVariants({ variant: "secondary", fullWidth: false }),
          "flex h-12 items-center gap-2 no-underline",
        )}
        href={`/api/auth/google?${queryParams.toString()}`}
      >
        {/*{t("actions.signInWithGoogle")}*/}
        Sign in with Google
      </a>
    </div>
  );
}
