import { Trans, useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import React from "react";

export function SupportDialog({ isOpen, setOpen }: { isOpen: boolean; setOpen: (open: boolean) => void }) {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={open => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("profile.supportModal.title")}</DialogTitle>
          <DialogDescription>
            <Trans
              t={t}
              i18nKey="profile.supportModal.description"
              components={{ email: <a href="mailto:support@mywishcraft.app" /> }}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
