"use client";

import { LogoLink } from "~/components/layout/LogoLink";
import * as React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { WishForm } from "~/components/wishlist/own/WishForm";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { showSuccessToast } from "~/components/ui/toasts";
import { useTranslation } from "react-i18next";
import { successMessages } from "~/core/errorMessages";

export function AuthenticatedHeader() {
  const [newWishFormVisible, setNewWishFormVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <header className="sticky top-0 flex h-20 w-screen items-center justify-center bg-background px-4">
        <LogoLink />
      </header>
      <Dialog open={newWishFormVisible} onOpenChange={setNewWishFormVisible}>
        <DialogContent>
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Add new wish</DialogTitle>
            </VisuallyHidden>
            <VisuallyHidden>
              <DialogDescription>Here you can add a new wish to your wishlist</DialogDescription>
            </VisuallyHidden>
            <DialogContent>
              <WishForm
                onBack={() => setNewWishFormVisible(false)}
                onActionSuccess={() => {
                  setNewWishFormVisible(false);
                  showSuccessToast(t(successMessages.SAVED));
                }}
              />
            </DialogContent>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
