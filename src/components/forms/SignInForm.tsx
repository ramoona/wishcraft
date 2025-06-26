"use client";

import { ButtonProps, buttonVariants } from "~/components/ui/button";

import { cn } from "~/utils/classnames";
import { Trans, useTranslation } from "react-i18next";
import { TypographyExtraLargeHeader } from "~/components/ui/typography";

export function SignInForm({ wishlistOwner, wishId }: { wishlistOwner?: string; wishId?: string }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-7 sm:mx-auto md:gap-12 lg:grid lg:grid-cols-2 lg:items-center lg:justify-center lg:gap-20">
      <div
        // className="aspect-[0.94] w-full shrink-0 sm:mx-auto sm:w-[306px] sm:grow-0 lg:mx-0 lg:w-[30vw] xl:w-[580px]"
        className="aspect-[0.94] w-full shrink-0 sm:mx-auto sm:w-[38dvh] lg:mx-0 lg:h-fit lg:w-full lg:max-w-[580px] lg:justify-self-end"
        style={{
          backgroundImage: "url('/images/art-3.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="max-w-xl sm:text-center lg:text-left">
        <TypographyExtraLargeHeader>
          <Trans
            t={t}
            i18nKey="login.heading"
            components={{
              br: <br className="hidden md:inline-block" />,
            }}
          />
        </TypographyExtraLargeHeader>
        <p className="mt-4 text-foreground/80 lg:max-w-xl">
          <Trans
            t={t}
            i18nKey="login.description"
            components={{
              b: <b className="font-bold" />,
              italic: <span className="italic" />,
            }}
          />
        </p>
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
