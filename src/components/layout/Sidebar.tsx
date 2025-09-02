"use client";

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  Sidebar as SidebarComponent,
  SidebarFooter,
} from "~/components/ui/sidebar";
import { LogoLink } from "~/components/layout/LogoLink";
import * as React from "react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTriggerDots,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "~/services/user/types";
import { cn } from "~/utils/classnames";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { useState } from "react";
import { Button } from "~/components/ui/button";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import Link from "next/link";
import { UserDetails } from "~/components/ui/user";
import { Badge } from "~/components/ui/badge";
import { WishModal } from "~/components/wishlist/WishModal";
import { ProfileForm } from "~/components/profile/ProfileForm";
import { useCopyProfileLink } from "~/components/profile/hooks";
import { SupportDialog } from "~/components/profile/SupportDialog";
import { PreferredLanguageForm } from "~/components/profile/PreferredLanguageForm";
import { AccountDeletionDialog } from "~/components/profile/AccountDeletionDialog";
import { WishesIcon } from "~/components/ui/icons/WishesIcon";
import { FriendsIcon } from "~/components/ui/icons/FriendsIcon";

export function Sidebar({ user, friendRequestsCount }: { user: User; friendRequestsCount: number }) {
  const { t } = useTranslation();
  const [newWishFormVisible, setNewWishFormVisible] = useState(false);
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <SidebarComponent>
      <SidebarHeader className="flex h-16 items-start justify-center px-4">
        <LogoLink />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={segments[1] === "wishes"} asChild>
              <span>
                <WishesIcon isSelected={segments[1] === "wishes"} />
                {t("navigation.wishes")}
              </span>
            </SidebarMenuButton>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton isActive={segments[2] === "active"} asChild>
                  <a href={`/${user.username}/wishes/active`} className="no-underline">
                    <span>{t("wishlist.tabs.active")}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton isActive={segments[2] === "fulfilled"} asChild>
                  <a href={`/${user.username}/wishes/fulfilled`} className="no-underline">
                    <span>{t("wishlist.tabs.fulfilled")}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton isActive={segments[2] === "archived"} asChild>
                  <a href={`/${user.username}/wishes/archived`} className="no-underline">
                    <span> {t("wishlist.tabs.archived")}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={segments[1] === "friends"} asChild>
              <span>
                <FriendsIcon isSelected={segments[1] === "friends"} /> {t("navigation.friends")}
              </span>
            </SidebarMenuButton>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton isActive={segments[2] === "your-friends"} asChild>
                  <a href={`/${user.username}/friends/your-friends`} className="no-underline">
                    <span>{t("friends.tabs.friends")}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton isActive={segments[2] === "requests"} asChild>
                  <a
                    href={`/${user.username}/friends/requests`}
                    className="flex justify-between gap-1 pr-1.5 no-underline"
                  >
                    <span>{t("friends.tabs.requests")}</span>
                    {friendRequestsCount > 0 && <Badge className="px-2">{friendRequestsCount}</Badge>}
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton isActive={segments[2] === "reserved-wishes"} asChild>
                  <a href={`/${user.username}/friends/reserved-wishes`} className="no-underline">
                    <span> {t("friends.tabs.reservedWishes")}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="block">
        <div className="px-2 pb-4">
          <Button onClick={() => setNewWishFormVisible(true)} fullWidth>
            {t("actions.addWish")}
          </Button>
        </div>
        <UserNav user={user} />
      </SidebarFooter>
      <WishModal username={user.username} isOpen={newWishFormVisible} onOpenChange={setNewWishFormVisible} />
    </SidebarComponent>
  );
}

function UserNav({ user }: { user: User }) {
  const { t } = useTranslation();
  const [isSupportSliderOpen, setSupportSliderOpen] = useState(false);
  const [profileFormVisible, setProfileFormVisible] = useState(false);
  const [isDeletionSliderOpen, setDeletionSliderOpen] = useState(false);
  const { copied, copyLink } = useCopyProfileLink({ user });

  return (
    <>
      <DropdownMenuPrimitive.Root aria-label="User menu">
        <DropdownMenuPrimitive.Trigger asChild>
          <SidebarMenuButton
            size="lg"
            className="flex items-center justify-between gap-2 hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex max-w-lg items-center gap-3">
              <Avatar small>
                <AvatarImage src={user.image || ""} alt={[user.firstName, user.lastName].join(" ")} />
                <AvatarFallback />
              </Avatar>
              <div className="flex grow flex-col">
                <span className="text-sm text-foreground/70">@{user.username}</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-[3px] pr-2">
              <DropdownMenuTriggerDots />
            </div>
          </SidebarMenuButton>
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuContent className="min-w-56 rounded-lg" side="right" align="end" sideOffset={4}>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex max-w-lg items-center gap-4 p-2">
              <Avatar small>
                <AvatarImage src={user.image || ""} alt={[user.firstName, user.lastName].join(" ")} />
                <AvatarFallback />
              </Avatar>
              <div className="flex grow flex-col">
                <span className="text-sm text-foreground/70">@{user.username}</span>
                <span className={cn("flex items-center gap-1")}>
                  <span className="flex flex-col text-sm">
                    {user.email && <span className="text-xs text-foreground/70">{user.email}</span>}
                  </span>
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="no-underline">
            <Link href={`/${user.username}/profile`}>{t("profile.menu.profile")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setSupportSliderOpen(true)} className="min-w-48">
            {t("profile.menu.support")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={e => {
              e.preventDefault();
              void copyLink();
            }}
          >
            {copied ? t("profile.shareWishlist.linkCopied") : t("profile.shareWishlist.copyLink")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="px-1 py-2">
            <PreferredLanguageForm hideLabel noSuccessToast filled />
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="no-underline">
            <Link href="/api/auth/logout" prefetch={false}>
              {t("profile.menu.signOut")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPrimitive.Root>
      <SupportDialog isOpen={isSupportSliderOpen} setOpen={setSupportSliderOpen} />
      <Dialog open={profileFormVisible} onOpenChange={open => setProfileFormVisible(open)}>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>You can edit your profile here</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <DialogContent className="space-y-4">
          <UserDetails user={user} email={user.email} context="sidebar" />
          <ProfileForm user={user} />
          <div className="flex flex-col items-center gap-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {t("profile.deleteAccountModal.dangerZone")}
            <Button
              variant="destructive"
              onClick={() => {
                setProfileFormVisible(false);
                setDeletionSliderOpen(true);
              }}
              size="lg"
            >
              {t("profile.menu.deleteAccount")}
            </Button>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setProfileFormVisible(false)} size="lg">
              {t("actions.close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <AccountDeletionDialog isOpen={isDeletionSliderOpen} setOpen={setDeletionSliderOpen} />
    </>
  );
}
