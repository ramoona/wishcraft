"use client";

import { Button } from "~/components/ui/button";
import * as React from "react";
import { useTranslation } from "react-i18next";

export function AddNewWish({ onOpenNewWishForm }: { onOpenNewWishForm: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="mt-auto px-4">
      <div className="flex items-center justify-center gap-4">
        <Button size="lg" type="button" onClick={onOpenNewWishForm}>
          {t("actions.addWish")}
        </Button>
      </div>
    </div>
  );
}
