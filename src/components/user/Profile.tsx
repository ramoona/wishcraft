"use client";
import { User } from "~/services/user/types";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useTransition } from "react";
import {
  deleteUserAccountAction,
  updateDateOfBirthAction,
  updateDefaultCurrencyAction,
  updateProfileVisibilityAction,
  updateReservedWishesVisibilityAction,
} from "~/services/user/actions";
import {
  DateOfBirthFormData,
  DefaultCurrencyFormData,
  ProfileVisibilityFormData,
  ReservedWishesVisibilityFormData,
} from "~/services/user/formData";
import { showErrorToast, showSuccessToast } from "~/components/ui/toasts";
import { getErrorMessage, getSuccessMessage } from "~/core/errorMessages";
import { Select } from "~/components/ui/select";
import { currencies, currencyNames } from "~/lib/currencies";
import { DAYS_IN_MONTHS, MONTHS } from "~/core/consts";

import { useTranslation } from "react-i18next";
import { UserDetails } from "~/components/ui/user";
import { DropdownMenu, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";

export function Profile({ user }: { user: User }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | null>(null);

  const link = `https://mywishcraft.app/${user.username}`;

  const copyLink = async () => {
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        setCopied(false);
      }, 3000) as unknown as number;
    }
  };

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return (
    <>
      <div className="bg-background">
        <UserDetails user={user} email={user.email} />
        <div className="mx-auto max-w-lg px-4">
          <form className="flex flex-col gap-4" autoComplete="off">
            <div className="flex flex-col gap-6">
              <DateOfBirth day={user.dayOfBirth ?? undefined} month={user.monthOfBirth ?? undefined} />
              <DefaultCurrency currency={user.defaultCurrency ?? ""} />
              <ProfileVisibility isProfileHidden={user.isProfileHidden} />
              <ReservedWishesVisibility showReserved={user.showReserved ?? false} />
              <PreferredLanguage />
            </div>
          </form>
        </div>
      </div>
      <div className="w-full bg-background p-4 pt-6">
        <div className="mx-auto grid max-w-lg grid-cols-[auto_6rem] gap-4">
          <Button size="lg" onClick={copyLink} fullWidth>
            {copied ? "Link copied!" : "Share Wishlist"}
          </Button>
          <ProfileDropdownMenu />
        </div>
      </div>
    </>
  );
}

function ProfileVisibility({ isProfileHidden: initialValue }: { isProfileHidden?: boolean | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isProfileHidden, setIsProfileHidden] = useState(initialValue ?? false);
  const { t } = useTranslation();

  const trigger = (value: boolean) => {
    setIsProfileHidden(value);
    startTransition(async () => {
      const { error } = await updateProfileVisibilityAction(
        ProfileVisibilityFormData.fromObject({ isProfileHidden: value }),
      );
      if (error) {
        showErrorToast(getErrorMessage(error, t));
      } else {
        showSuccessToast(getSuccessMessage("SAVED", t));
        router.refresh();
      }
    });
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <Label className="pl-2">Private wishlist</Label>
        <div className="pl-2 text-xs text-foreground/60">
          {isProfileHidden ? (
            <span>
              Your wishlist is <span className="font-semibold">private</span>. Others can&#39;t see your wishes.
            </span>
          ) : (
            <span>
              Your wishlist is <span className="font-semibold">public</span>. Others can see your wishes.
            </span>
          )}
        </div>
      </div>
      <Switch checked={isProfileHidden ?? false} onCheckedChange={trigger} disabled={isPending} />
    </div>
  );
}

function ReservedWishesVisibility({ showReserved: initialValue }: { showReserved: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showReserved, setShowReserved] = useState(initialValue);
  const { t } = useTranslation();

  const trigger = (value: boolean) => {
    setShowReserved(value);
    startTransition(async () => {
      const { error } = await updateReservedWishesVisibilityAction(
        ReservedWishesVisibilityFormData.fromObject({ showReserved: value }),
      );
      if (error) {
        showErrorToast(getErrorMessage(error, t));
      } else {
        showSuccessToast(getSuccessMessage("SAVED", t));
        router.refresh();
      }
    });
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <Label className="pl-2">Show reservation status</Label>
        <div className="pl-2 text-xs text-foreground/60">
          {showReserved ? (
            <span>You will see whether your wishes are reserved, but not by whom</span>
          ) : (
            <span>You will not see whether your wishes are reserved.</span>
          )}
        </div>
      </div>
      <Switch checked={showReserved ?? false} onCheckedChange={trigger} disabled={isPending} />
    </div>
  );
}

function DefaultCurrency({ currency: initialValue }: { currency: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currency, setCurrency] = useState(initialValue);
  const { t } = useTranslation();

  const trigger = () => {
    setCurrency(currency);
    startTransition(async () => {
      const { error } = await updateDefaultCurrencyAction(DefaultCurrencyFormData.fromObject({ currency }));
      if (error) {
        showErrorToast(getErrorMessage(error, t));
      } else {
        showSuccessToast(getSuccessMessage("SAVED", t));
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="pl-2">Default currency</Label>
      <Select
        value={currency}
        onChange={trigger}
        disabled={isPending}
        placeholder="Select currency"
        options={currencies.map(currency => ({ value: currency, label: currencyNames[currency] }))}
      />
    </div>
  );
}

export function DateOfBirth({ day: initialDay, month: initialMonth }: { day?: number; month?: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [day, setDay] = useState<number | undefined>(initialDay);
  const [month, setMonth] = useState<number | undefined>(initialMonth);
  const { t } = useTranslation();

  const trigger = ({ day, month }: { day: number; month: number }) => {
    startTransition(async () => {
      const { error } = await updateDateOfBirthAction(
        DateOfBirthFormData.fromObject({ dayOfBirth: day, monthOfBirth: month }),
      );
      if (error) {
        showErrorToast(getErrorMessage(error, t));
      } else {
        showSuccessToast(getSuccessMessage("SAVED", t));
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="pl-2">Birthday</Label>
      <div className="grid w-full grid-cols-2 gap-4">
        <Select
          value={month ? String(month) : ""}
          placeholder={"Select month"}
          onChange={month => {
            setMonth(parseInt(month));
            setDay(undefined);
          }}
          options={Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: MONTHS[i] }))}
          disabled={isPending}
        />
        <Select
          key={month}
          value={day ? String(day) : ""}
          placeholder={"Select day"}
          disabled={!month || isPending}
          onChange={day => {
            setDay(parseInt(day));

            if (month) {
              trigger({ month, day: parseInt(day) });
            }
          }}
          options={
            month
              ? Array.from({ length: DAYS_IN_MONTHS[month - 1] }, (_, i) => ({
                  value: String(i + 1),
                  label: `${i + 1}`,
                }))
              : []
          }
        />
      </div>
    </div>
  );
}

export function ProfileDropdownMenu() {
  const router = useRouter();
  const [isDeletionSliderOpen, setDeletionSliderOpen] = useState(false);
  const [isSupportSliderOpen, setSupportSliderOpen] = useState(false);

  return (
    <>
      <DropdownMenu
        trigger={
          <Button
            variant="outline"
            size="lg"
            className="flex items-center justify-center gap-1 px-4"
            aria-label="Profile dropdown menu"
            minWidth={false}
            fullWidth
          >
            <div className={`size-1 rounded-full bg-black`} />
            <div className={`size-1 rounded-full bg-black`} />
            <div className={`size-1 rounded-full bg-black`} />
          </Button>
        }
      >
        <DropdownMenuItem onSelect={() => router.push("/api/auth/logout")} className="min-w-48">
          Sign out
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setSupportSliderOpen(true)} className="min-w-48">
          Support
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setDeletionSliderOpen(true)}
          className="min-w-48 bg-destructive/10 text-destructive hover:bg-destructive/20"
        >
          Delete account
        </DropdownMenuItem>
      </DropdownMenu>
      <AccountDeletionDialog isOpen={isDeletionSliderOpen} setOpen={setDeletionSliderOpen} />
      <SupportDialog isOpen={isSupportSliderOpen} setOpen={setSupportSliderOpen} />
    </>
  );
}

function SupportDialog({ isOpen, setOpen }: { isOpen: boolean; setOpen: (open: boolean) => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={open => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Need some help?</DialogTitle>
          <DialogDescription>
            If something is not working as expected, or you have a suggestion, please contact us at{" "}
            <a href="mailto:support@mywishcraft.app">support@mywishcraft.app</a>.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function AccountDeletionDialog({ isOpen, setOpen }: { isOpen: boolean; setOpen: (open: boolean) => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  const deleteAccount = () => {
    startTransition(async () => {
      const { error } = await deleteUserAccountAction();
      if (error) {
        if (error === "UNAUTHORIZED") {
          router.push("/");
        } else {
          showErrorToast(getErrorMessage(error, t));
        }
      } else {
        router.push("/");
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={open => setOpen(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove all your data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={deleteAccount} variant="destructive">
            Delete my account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function PreferredLanguage() {
  return (
    <div className="flex flex-col gap-2">
      <Label className="pl-2">Preferred Language</Label>
      <LanguageSwitcher />
    </div>
  );
}
