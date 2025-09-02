"use client";

import { PropsWithChildren } from "react";
import * as React from "react";
import { ServerErrorCode } from "~/services/errors";
import { UserErrorCode } from "~/services/user/errors";
import { WishlistErrorCode } from "~/services/wishlist/errors";
import { Trans, useTranslation } from "react-i18next";
import { getErrorMessage } from "~/core/error-messages";
import Link from "next/link";
import { TextOnlyLogo } from "~/components/ui/logo";
import Image from "next/image";
import { TypographyExtraLargeHeader } from "~/components/ui/typography";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/utils/classnames";

export function ErrorMessage({
  errorCode = "UNKNOWN",
  context,
  errorMessage,
}: PropsWithChildren<{
  errorCode?: ServerErrorCode | UserErrorCode | WishlistErrorCode;
  context?: Record<string, string>;
  errorMessage?: string;
}>) {
  const { t } = useTranslation();

  if (errorMessage) {
    // eslint-disable-next-line no-console
    console.error("Error", errorMessage);
  }

  return (
    <div className="fixed left-0 top-0 z-50 grid h-dvh min-h-screen w-screen grid-rows-[min-content_auto_min-content] bg-primary">
      <header className="relative flex h-20 w-screen items-center justify-center">
        <Link href="/" className="h-fit">
          <TextOnlyLogo />
        </Link>
      </header>
      <main className="relative mx-auto w-full max-w-lg px-4 sm:text-center">
        <div className="flex flex-col items-center gap-6 px-11">
          <Image src="/images/art-2.png" alt="Art" width={314} height={268} className="mt-4" priority />
        </div>
        <div className="mt-10 flex flex-col gap-2">
          <TypographyExtraLargeHeader>{t("error.error")}</TypographyExtraLargeHeader>
        </div>
        <p className="mt-2">{getErrorMessage(errorCode, t, context)}</p>
        <p className="mt-6 text-foreground/60">
          <Trans
            i18nKey="error.persistingErrorHint"
            t={t}
            components={{ email: <a href="mailto:support@mywishcraft.app" /> }}
          />
        </p>

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "secondary", fullWidth: false, size: "lg" }),
            "mx-auto mt-10 flex h-12 items-center gap-2 no-underline",
          )}
        >
          {t("buttons.backToSafety")}
        </Link>
      </main>
    </div>
  );
}
