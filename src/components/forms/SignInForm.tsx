"use client";

import { ButtonProps, buttonVariants } from "~/components/ui/button";

import { cn } from "~/utils/classnames";
import { Trans, useTranslation } from "react-i18next";
import { TypographyExtraLargeHeader } from "~/components/ui/typography";

export function SignInForm({ wishlistOwner, wishId }: { wishlistOwner?: string; wishId?: string }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex h-full flex-col items-center pb-4">
      <div
        className="w-full grow sm:mt-10 sm:h-[284px] sm:w-[306px] sm:grow-0 sm:p-0"
        style={{
          backgroundImage: "url('/images/art-3.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="mt-6 sm:text-center">
        <TypographyExtraLargeHeader>{t("login.heading")}</TypographyExtraLargeHeader>
      </div>
      <div className="mt-6 flex flex-col items-center">
        <SignInButton wishlistOwner={wishlistOwner} wishId={wishId} />
        <p className="mt-4 text-center text-sm text-foreground/80">
          <Trans
            t={t}
            i18nKey="login.loginAgreement"
            components={{
              terms: <a className="underline" href={`/terms-of-service/${i18n.language}`} target="_blank" />,
              privacy: <a className="underline" href={`/privacy-policy/${i18n.language}`} target="_blank" />,
            }}
          />
        </p>
      </div>
    </div>
  );
}

export function SignInButton({
  wishlistOwner,
  wishId,
  buttonVariant = "secondary",
}: {
  wishlistOwner?: string;
  wishId?: string;
  buttonVariant?: ButtonProps["variant"];
}) {
  const queryParams = new URLSearchParams();
  const { t, i18n } = useTranslation();

  queryParams.append("language", i18n.language);

  if (wishlistOwner) {
    queryParams.append("wishlistOwner", wishlistOwner);
  }

  if (wishId) {
    queryParams.append("wishId", wishId);
  }

  return (
    <a
      className={cn(
        buttonVariants({ variant: buttonVariant, fullWidth: false, size: "lg" }),
        "flex items-center gap-2 no-underline",
      )}
      href={`/api/auth/google?${queryParams.toString()}`}
    >
      {t("actions.signInWithGoogle")}
    </a>
  );
}
