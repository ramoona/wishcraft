"use client";
import { User } from "~/services/user/types";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { UserDetails } from "~/components/ui/user";
import { DropdownMenu, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { ProfileForm } from "~/components/profile/ProfileForm";
import { useCopyProfileLink } from "~/components/profile/hooks";
import { SupportDialog } from "~/components/profile/SupportDialog";
import { AccountDeletionDialog } from "~/components/profile/AccountDeletionDialog";

export function Profile({ user }: { user: User }) {
  const { t } = useTranslation();
  const { copied, copyLink } = useCopyProfileLink({ user });
  const [isDeletionSliderOpen, setDeletionSliderOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 bg-background lg:bg-transparent lg:p-0">
        <DesktopOnly>
          <h1 className="mt-8 scroll-m-20 text-4xl font-bold tracking-tight">{t("profile.heading")}</h1>
        </DesktopOnly>
        <div className="grow">
          <MobileOnly>
            <div className="mb-4 grid w-full grid-cols-[auto_max-content] items-center pr-4">
              <UserDetails user={user} email={user.email} context="profile" />
              <ProfileDropdownMenu />
            </div>
          </MobileOnly>
          <ProfileForm user={user} />
          <DesktopOnly>
            <div className="mt-4 flex max-w-xl flex-col items-center gap-4 rounded-lg border bg-background p-4 text-sm text-destructive">
              {t("profile.deleteAccountModal.dangerZone")}
              <Button variant="destructive" onClick={() => setDeletionSliderOpen(true)} size="lg">
                {t("profile.menu.deleteAccount")}
              </Button>
              <AccountDeletionDialog isOpen={isDeletionSliderOpen} setOpen={setDeletionSliderOpen} />
            </div>
          </DesktopOnly>
        </div>
        <MobileOnly>
          <div className="flex w-full justify-center bg-background p-4 pt-6">
            <Button size="lg" onClick={copyLink}>
              {copied ? t("profile.shareWishlist.linkCopied") : t("profile.shareWishlist.copyLink")}
            </Button>
          </div>
        </MobileOnly>
      </div>
    </>
  );
}

function ProfileDropdownMenu() {
  const router = useRouter();
  const [isDeletionSliderOpen, setDeletionSliderOpen] = useState(false);
  const [isSupportSliderOpen, setSupportSliderOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <DropdownMenu ariaLabel="Profile menu">
        <DropdownMenuItem onSelect={() => router.push("/api/auth/logout")} className="min-w-48">
          {t("profile.menu.signOut")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setSupportSliderOpen(true)} className="min-w-48">
          {t("profile.menu.support")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setDeletionSliderOpen(true)}
          className="min-w-48 bg-destructive/10 text-destructive hover:bg-destructive/20"
        >
          {t("profile.menu.deleteAccount")}
        </DropdownMenuItem>
      </DropdownMenu>
      <AccountDeletionDialog isOpen={isDeletionSliderOpen} setOpen={setDeletionSliderOpen} />
      <SupportDialog isOpen={isSupportSliderOpen} setOpen={setSupportSliderOpen} />
    </>
  );
}
