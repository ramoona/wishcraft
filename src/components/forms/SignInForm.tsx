"use client";

import { ButtonProps, buttonVariants } from "~/components/ui/button";

import { cn } from "~/utils/classnames";
import { Trans, useTranslation } from "react-i18next";
import { TypographyExtraLargeHeader } from "~/components/ui/typography";

export function SignInForm({ wishlistOwner, wishId }: { wishlistOwner?: string; wishId?: string }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex min-h-full flex-col items-center py-10 sm:mx-auto lg:flex-row lg:items-center lg:justify-center lg:gap-20 lg:pb-32">
      <div
        className="aspect-[0.94] w-full shrink-0 sm:mx-auto sm:w-[306px] sm:grow-0 lg:mx-0 lg:w-[580px]"
        style={{
          backgroundImage: "url('/images/art-3.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="sm:text-center lg:mb-10 lg:max-w-lg lg:text-left">
        <TypographyExtraLargeHeader>{t("login.heading")}</TypographyExtraLargeHeader>
        <p className="mt-4 text-foreground/80 lg:max-w-lg">{t("login.description")}</p>
        <div className="mt-6 flex flex-col items-center lg:mt-10 lg:items-start">
          <SignInButton wishlistOwner={wishlistOwner} wishId={wishId} />
          <p className="mt-4 text-sm text-foreground/70">
            <Trans
              t={t}
              i18nKey="login.loginAgreement"
              components={{
                terms: <a className="underline" href={`/terms-of-service/${i18n.language}`} target="_blank" />,
                privacy: <a className="underline" href={`/privacy-policy/${i18n.language}`} target="_blank" />,
              }}
            />
          </p>
          <p className="mt-4 text-sm text-foreground/70 sm:mt-1">{t("login.loginAgreement2")}</p>
        </div>
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
