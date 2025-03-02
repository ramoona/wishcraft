"use client";
import { User } from "~/services/user/types";
import { EyeSlash, HeartBreak, SignOut } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Button, buttonVariants } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import {
  updateDateOfBirthAction,
  updateDefaultCurrencyAction,
  updateReservedWishesVisibilityAction,
} from "~/services/user/actions";
import {
  DateOfBirthFormData,
  DefaultCurrencyFormData,
  ReservedWishesVisibilityFormData,
} from "~/services/user/formData";
import { showErrorToast, showSuccessToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/toastMessages";
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
import { SignInForm } from "~/components/forms/SignInForm";

export function Profile({ user }: { user: User }) {
  return (
    <form className="flex flex-col gap-6" autoComplete="off">
      <div className="items-top flex gap-4">
        <UserPic imageUrl={user.image} />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-lg">
            <span>{[user.firstName, user.lastName].filter(Boolean).join(" ")}</span>
            <span className="text-sm text-foreground/70">@{user.username}</span>
          </div>
        </div>
      </div>
      <Email email={user.email} />
      <Username username={user.username ?? ""} />
      <DateOfBirth day={user.dayOfBirth ?? undefined} month={user.monthOfBirth ?? undefined} />
      <DefaultCurrency currency={user.defaultCurrency ?? ""} />
      <ReservedWishesVisibility showReserved={user.showReserved ?? false} />

      <div className="flex items-center gap-2">
        <Link href="/api/auth/logout" className={buttonVariants({ variant: "secondary" })} prefetch={false}>
          <div className="flex items-center gap-2 no-underline">
            <SignOut size={16} />
            Sign out
          </div>
        </Link>
        <DeleteAccountButton />
      </div>
    </form>
  );
}

function UserPic({ imageUrl }: { imageUrl?: string | null }) {
  return (
    <Avatar>
      <AvatarImage src={imageUrl || ""} />
      <AvatarFallback />
    </Avatar>
  );
}

function ReservedWishesVisibility({ showReserved: initialValue }: { showReserved: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showReserved, setShowReserved] = useState(initialValue);

  const trigger = (value: boolean) => {
    setShowReserved(value);
    startTransition(async () => {
      const { error } = await updateReservedWishesVisibilityAction(
        ReservedWishesVisibilityFormData.fromObject({ showReserved: value }),
      );
      if (error) {
        showErrorToast(getErrorMessage(error));
      } else {
        showSuccessToast("Saved!");
        router.refresh();
      }
    });
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <Label className="pl-2">Show reservation status</Label>
        <div className="pl-2 text-sm text-foreground/70">
          {showReserved ? (
            <span>
              When someone reserves your wish, you will see <span className="font-semibold">reserved</span> status but
              not who reserved it.
            </span>
          ) : (
            <span> When someone reserves your wish, you will not see any status.</span>
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

  const trigger = () => {
    setCurrency(currency);
    startTransition(async () => {
      const { error } = await updateDefaultCurrencyAction(DefaultCurrencyFormData.fromObject({ currency }));
      if (error) {
        showErrorToast(getErrorMessage(error));
      } else {
        showSuccessToast("Saved!");
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="pl-2">Default Currency</Label>
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

  const trigger = ({ day, month }: { day: number; month: number }) => {
    startTransition(async () => {
      const { error } = await updateDateOfBirthAction(
        DateOfBirthFormData.fromObject({ dayOfBirth: day, monthOfBirth: month }),
      );
      if (error) {
        showErrorToast(getErrorMessage(error));
      } else {
        showSuccessToast("Saved!");
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="pl-2">Day of Birth</Label>
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

function Username({ username }: { username: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="pl-2">Username</Label>
      <div className="flex items-center gap-4">
        <Input type="text" name="username" value={`@${username}`} onChange={() => undefined} disabled />
      </div>
      <p className="pl-2 text-xs text-foreground/70">
        Your username is part of your personal link. Changing it will break the old link. If you still want to proceed,
        contact{" "}
        <a className="font-semibold" href="mailto:mywishcraft.app">
          help@mywishcraft.app
        </a>
        .
      </p>
    </div>
  );
}

function Email({ email }: { email: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="pl-2">Email</Label>
      <div className="flex items-center gap-4">
        <Input type="text" name="email" value={email} onChange={() => undefined} disabled />
      </div>
      <p className="pl-2 text-xs text-foreground/70">Accounts signed in with Google cannot change their email.</p>
    </div>
  );
}

function DeleteAccountButton() {
  const [isSliderOpen, setSliderOpen] = useState(false);
  return (
    <div>
      <Button variant="destructive" className="flex items-center gap-2" onClick={() => setSliderOpen(true)}>
        <HeartBreak className="h-5 w-5" />
        Delete account
      </Button>
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
              <Button variant="destructive" className="flex items-center gap-2">
                <HeartBreak className="h-5 w-5" />
                Permanently delete my account
              </Button>
            </div>
            <p className="mt-4 pl-2 text-sm text-foreground/70">
              If you want to temporarily hide your profile from others, consider setting it to{" "}
              <span className="font-semibold">private</span> instead.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="secondary" className="flex items-center gap-2">
                <EyeSlash className="h-5 w-5" />
                Make my profile private
              </Button>
            </div>
          </div>
          <VisuallyHidden>
            <DrawerClose>Close</DrawerClose>
          </VisuallyHidden>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
