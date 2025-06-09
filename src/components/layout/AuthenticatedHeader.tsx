"use client";

import { LogoLink } from "~/components/layout/LogoLink";
import NavMenu from "~/components/layout/NavMenu";
import { OtherUser, User } from "~/services/user/types";
import { AddNewWish } from "~/components/wishlist/own/AddNewWish";
import * as React from "react";
import { useState } from "react";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { WishForm } from "~/components/wishlist/own/WishForm";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { showSuccessToast } from "~/components/ui/toasts";
import { useTranslation } from "react-i18next";
import { successMessages } from "~/core/errorMessages";

export function AuthenticatedHeader({ user, otherUser }: { user: User; otherUser?: OtherUser }) {
  const [newWishFormVisible, setNewWishFormVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <DesktopOnly>
        <header className="sticky top-0 mx-auto grid h-20 w-screen max-w-screen-xl grid-cols-[1fr_auto_1fr] items-center justify-center bg-background px-4 lg:justify-between lg:px-8">
          <LogoLink />
          {user.isOnboarded && <NavMenu user={user} otherUser={otherUser} />}
          {user.isOnboarded && <AddNewWish onOpenNewWishForm={() => setNewWishFormVisible(true)} />}
        </header>
      </DesktopOnly>
      <MobileOnly>
        <header className="sticky top-0 flex h-20 w-screen items-center justify-center bg-background px-4">
          <LogoLink />
        </header>
      </MobileOnly>
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
