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
  updateLanguageAction,
  updateProfileVisibilityAction,
  updateReservedWishesVisibilityAction,
} from "~/services/user/actions";
import {
  DateOfBirthFormData,
  DefaultCurrencyFormData,
  LanguageFormData,
  ProfileVisibilityFormData,
  ReservedWishesVisibilityFormData,
} from "~/services/user/formData";
import { showErrorToast, showSuccessToast } from "~/components/ui/toasts";
import { getErrorMessage, getSuccessMessage } from "~/core/errorMessages";
import { Select } from "~/components/ui/select";
import { currencies, getTranslatedCurrency } from "~/lib/i18n/currencies";
import { DAYS_IN_MONTHS } from "~/core/consts";

import { Trans, useTranslation } from "react-i18next";
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
import { getTranslatedMonth } from "~/lib/i18n/months";
import { SupportedLanguages } from "~/lib/i18n/settings";

export function Profile({ user }: { user: User }) {
  const { t } = useTranslation();
  const { copied, copyLink } = useCopyProfileLink({ user });

  return (
    <>
      <div className="flex flex-col gap-4 bg-background">
        <div className="grow">
          <div className="grid w-full grid-cols-[auto_max-content] items-center pr-4">
            <UserDetails user={user} email={user.email} context="profile" />
            <ProfileDropdownMenu />
          </div>
          <ProfileForm user={user} />
        </div>
        <div className="flex w-full justify-center bg-background p-4 pt-6">
          <Button size="lg" onClick={copyLink}>
            {copied ? t("profile.shareWishlist.linkCopied") : t("profile.shareWishlist.copyLink")}
          </Button>
        </div>
      </div>
    </>
  );
}

export function ProfileForm({ user }: { user: User }) {
  return (
    <div className="mx-auto max-w-lg px-4 lg:mx-0 lg:px-0">
      <form className="flex flex-col gap-4" autoComplete="off">
        <div className="flex flex-col gap-6">
          <DateOfBirth day={user.dayOfBirth ?? undefined} month={user.monthOfBirth ?? undefined} />
          <div className="grid w-full grid-cols-2 gap-4">
            <DefaultCurrency currency={user.defaultCurrency ?? ""} />
            <PreferredLanguage />
          </div>
          <ProfileVisibility isProfileHidden={user.isProfileHidden} />
          <ReservedWishesVisibility showReserved={user.showReserved ?? false} />
        </div>
      </form>
    </div>
  );
}

export function useCopyProfileLink({ user }: { user: User }) {
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

  return { copied, copyLink };
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
        <Label className="pl-2">{t("profile.privateWishlist")}</Label>
        <div className="pl-2 text-xs text-foreground/60">
          {isProfileHidden ? (
            <Trans
              t={t}
              i18nKey="profile.publicWishlistEnabled"
              components={{ bold: <span className="font-semibold" /> }}
            />
          ) : (
            <Trans
              t={t}
              i18nKey="profile.publicWishlistDisabled"
              components={{ bold: <span className="font-semibold" /> }}
            />
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
        <Label className="pl-2">{t("profile.reservationStatus")}</Label>
        <div className="pl-2 text-xs text-foreground/60">
          {showReserved ? (
            <span>{t("profile.reservationStatusEnabled")}</span>
          ) : (
            <span>{t("profile.reservationStatusDisabled")}</span>
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

  const trigger = (currency: string) => {
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
      <Label className="pl-2">{t("profile.preferredCurrency")}</Label>
      <Select
        value={currency}
        onChange={trigger}
        disabled={isPending}
        placeholder="Select currency"
        options={currencies.map(currency => ({ value: currency, label: getTranslatedCurrency(currency, t) }))}
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
      <Label className="pl-2">{t("profile.birthday")}</Label>
      <div className="grid w-full grid-cols-2 gap-4">
        <Select
          value={month ? String(month) : ""}
          placeholder={t("placeholders.selectMonth")}
          onChange={month => {
            setMonth(parseInt(month));
            setDay(undefined);
          }}
          options={Array.from({ length: 12 }, (_, i) => ({
            value: String(i + 1),
            label: getTranslatedMonth(i + 1, t),
          }))}
          disabled={isPending}
        />
        <Select
          key={month}
          value={day ? String(day) : ""}
          placeholder={t("placeholders.selectDay")}
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

export function SupportDialog({ isOpen, setOpen }: { isOpen: boolean; setOpen: (open: boolean) => void }) {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={open => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("profile.supportModal.title")}</DialogTitle>
          <DialogDescription className="pt-4">
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

export function AccountDeletionDialog({ isOpen, setOpen }: { isOpen: boolean; setOpen: (open: boolean) => void }) {
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
          <AlertDialogTitle>{t("profile.deleteAccountModal.title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("profile.deleteAccountModal.description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("actions.cancel")}</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={deleteAccount} variant="destructive">
            {t("profile.deleteAccountModal.confirmButton")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function PreferredLanguage({ hideLabel = false }: { hideLabel?: boolean }) {
  const { t } = useTranslation();
  const router = useRouter();

  const trigger = async (value: SupportedLanguages) => {
    const { error } = await updateLanguageAction(LanguageFormData.fromObject({ language: value }));
    if (error) {
      showErrorToast(getErrorMessage(error, t));
    } else {
      showSuccessToast(getSuccessMessage("SAVED", t));
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {!hideLabel && <Label className="pl-2">{t("profile.preferredLanguage")}</Label>}
      <LanguageSwitcher onChange={trigger} />
    </div>
  );
}
