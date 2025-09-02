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
                <WishesIcon fill="stroke-black" />
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
                <FriendsIcon fill="stroke-black" /> {t("navigation.friends")}
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

function WishesIcon({ fill }: { fill?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="size-5">
      <path
        stroke="#000"
        className={fill}
        strokeWidth="2"
        d="M9.937 1a.518.518 0 0 1 .476.308l.028.08v.002c.546 2.109 1.499 3.87 2.886 5.238 1.301 1.282 2.942 2.177 4.885 2.706l.393.1a.52.52 0 0 1 .088.982l-.08.028h-.003c-2.106.544-3.865 1.496-5.231 2.883-1.28 1.3-2.174 2.942-2.704 4.886l-.102.392v.002a.518.518 0 0 1-.976.088l-.029-.08v-.002l-.107-.391c-.559-1.937-1.477-3.565-2.777-4.847-1.301-1.282-2.943-2.176-4.886-2.705l-.393-.102a.52.52 0 0 1-.01-1.01c2.108-.544 3.869-1.494 5.236-2.881 1.282-1.3 2.176-2.942 2.705-4.887l.1-.393h.002A.517.517 0 0 1 9.937 1Z"
      />
    </svg>
  );
}

function FriendsIcon({ fill }: { fill?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="size-5">
      <path
        stroke="#000"
        className={fill}
        strokeWidth="2"
        d="M10.016 1.677a.981.981 0 0 1 .658.257l.073.073a5.455 5.455 0 0 0 4.534 1.905v.001a.979.979 0 0 1 .963.625.975.975 0 0 1 .062.298v.102a5.493 5.493 0 0 0 1.885 4.577.96.96 0 0 1-.008 1.432 5.413 5.413 0 0 0-1.897 4.53.968.968 0 0 1-1.033 1.018h-.001a5.368 5.368 0 0 0-4.514 1.837.988.988 0 0 1-1.398.068l-.073-.074a5.45 5.45 0 0 0-4.536-1.905H4.63a.965.965 0 0 1-.855-.622.97.97 0 0 1-.062-.4 5.492 5.492 0 0 0-1.885-4.58.958.958 0 0 1 .009-1.432l-.001-.001a5.406 5.406 0 0 0 1.892-4.527h.001a.973.973 0 0 1 1.034-1.02A5.37 5.37 0 0 0 9.283 2a.981.981 0 0 1 .733-.324Z"
      />
    </svg>
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
