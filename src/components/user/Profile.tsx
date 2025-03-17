"use client";
import { User } from "~/services/user/types";
import { EyeSlash, HeartBreak } from "@phosphor-icons/react";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { useTranslation } from "~/utils/useTranslation";
import { UserDetails } from "~/components/ui/user";
import { DropdownMenu, DropdownMenuItem } from "~/components/ui/dropdown-menu";

export function Profile({ user }: { user: User }) {
  return (
    <form className="flex h-full flex-col gap-4 bg-background" autoComplete="off">
      <UserDetails user={user} email={user.email} />
      <div className="flex flex-col gap-6 px-4">
        <DateOfBirth day={user.dayOfBirth ?? undefined} month={user.monthOfBirth ?? undefined} />
        <DefaultCurrency currency={user.defaultCurrency ?? ""} />
        <ProfileVisibility isProfileHidden={user.isProfileHidden} />
        <ReservedWishesVisibility showReserved={user.showReserved ?? false} />
      </div>
    </form>
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

// function Username({ username }: { username: string }) {
//   return (
//     <div className="flex flex-col gap-2">
//       <Label className="pl-2">Username</Label>
//       <div className="flex items-center gap-4">
//         <Input type="text" name="username" value={`@${username}`} onChange={() => undefined} disabled />
//       </div>
//       <p className="pl-2 text-xs text-foreground/70">
//         Your username is part of your personal link. Changing it will break the old link. If you still want to proceed,
//         contact{" "}
//         <a className="font-semibold" href="mailto:mywishcraft.app">
//           help@mywishcraft.app
//         </a>
//         .
//       </p>
//     </div>
//   );
// }

// function Email({ email }: { email: string }) {
//   return (
//     <div className="flex flex-col gap-2">
//       <Label className="pl-2">Email</Label>
//       <div className="flex items-center gap-4">
//         <Input type="text" name="email" value={email} onChange={() => undefined} disabled />
//       </div>
//       <p className="pl-2 text-xs text-foreground/70">Accounts signed in with Google cannot change their email.</p>
//     </div>
//   );
// }

export function ProfileDropdownMenu({ user }: { user: User }) {
  const router = useRouter();
  const [isSliderOpen, setSliderOpen] = useState(false);
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

  const hideProfile = () => {
    startTransition(async () => {
      const { error } = await updateProfileVisibilityAction(
        ProfileVisibilityFormData.fromObject({ isProfileHidden: true }),
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
        <DropdownMenuItem
          onSelect={() => setSliderOpen(true)}
          className="min-w-48 bg-destructive/10 text-destructive hover:bg-destructive/90"
        >
          Delete account
        </DropdownMenuItem>
      </DropdownMenu>
      <Drawer open={isSliderOpen} onClose={() => setSliderOpen(false)} onOpenChange={open => setSliderOpen(open)}>
        <DrawerTrigger asChild></DrawerTrigger>
        <DrawerContent className="px-6 pb-4">
          <VisuallyHidden>
            <DrawerTitle>Delete account</DrawerTitle>
            <DrawerDescription>Permanently delete your account</DrawerDescription>
          </VisuallyHidden>
          <div className="px-4 py-8">
            <p className="mt-4 pl-2 text-sm text-foreground/70">
              <span className="font-bold">This action is irreversible.</span> All your data will be permanently deleted.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={deleteAccount}
                disabled={isPending}
              >
                <HeartBreak className="size-5" />
                Permanently delete my account
              </Button>
            </div>
            {user.isProfileHidden ? (
              <p className="mt-4 pl-2 text-sm text-foreground/70">
                Note that your profile is <span className="font-semibold">private</span>. No one can see your wishes.
              </p>
            ) : (
              <p className="mt-4 pl-2 text-sm text-foreground/70">
                If you want to temporarily hide your profile from others, consider setting it to{" "}
                <span className="font-semibold">private</span> instead.
              </p>
            )}
            {!user.isProfileHidden && (
              <div className="mt-4 flex items-center gap-2">
                <Button variant="secondary" className="flex items-center gap-2" onClick={hideProfile}>
                  <EyeSlash className="size-5" />
                  Make my profile private
                </Button>
              </div>
            )}
          </div>
          <VisuallyHidden>
            <DrawerClose>Close</DrawerClose>
          </VisuallyHidden>
        </DrawerContent>
      </Drawer>
    </>
  );
}
