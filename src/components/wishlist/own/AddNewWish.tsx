"use client";

import { Button } from "~/components/ui/button";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";

export function AddNewWish({ onOpenNewWishForm }: { onOpenNewWishForm: () => void }) {
  const { t } = useTranslation();

  return (
    <>
      <DesktopOnly>
        <div className="flex w-full justify-end">
          <Button size="lg" type="button" onClick={onOpenNewWishForm}>
            {t("actions.addWish")}
          </Button>
        </div>
      </DesktopOnly>
      <MobileOnly>
        <div className="mt-auto px-4 lg:mx-0">
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" type="button" onClick={onOpenNewWishForm}>
              {t("actions.addWish")}
            </Button>
          </div>
        </div>
      </MobileOnly>
    </>
  );
}
