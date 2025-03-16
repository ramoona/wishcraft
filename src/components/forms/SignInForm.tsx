"use client";

import { buttonVariants } from "~/components/ui/button";

import { cn } from "~/utils/classnames";
import { useTranslation } from "~/utils/useTranslation";
import { TypographyExtraLarge, TypographyLeadBody } from "~/components/ui/typography";

export function SignInForm({ wishlistOwner, wishId }: { wishlistOwner?: string; wishId?: string }) {
  const queryParams = new URLSearchParams();
  const { t } = useTranslation();

  if (wishlistOwner) {
    queryParams.append("wishlistOwner", wishlistOwner);
  }

  if (wishId) {
    queryParams.append("wishId", wishId);
  }

  return (
    <div className="flex flex-col items-center gap-6 px-11 pb-28">
      <div className="flex flex-col gap-2">
        <TypographyExtraLarge>Make your wishes come true!</TypographyExtraLarge>
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
        {t("actions.signInWithGoogle")}
      </a>
    </div>
  );
}
