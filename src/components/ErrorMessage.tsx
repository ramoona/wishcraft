"use client";

import { PropsWithChildren } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { ServerErrorCode } from "~/services/errors";
import { UserErrorCode } from "~/services/user/errors";
import { WishlistErrorCode } from "~/services/wishlist/errors";
import { useTranslation } from "~/utils/useTranslation";
import { getErrorMessage } from "~/core/errorMessages";

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
    <div className="flex items-center justify-center p-8">
      <div className="w-fit">
        <Alert variant="destructive">
          <AlertTitle className="flex items-center gap-2">
            <WarningCircle className="size-5" /> {t("error")}
          </AlertTitle>
          <AlertDescription>{getErrorMessage(errorCode, t, context)}</AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
