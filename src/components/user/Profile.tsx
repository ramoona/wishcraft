"use client";
import { User } from "~/services/user/types";
import { SignOut } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Button, buttonVariants } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useDeferredValue, useEffect, useState, useTransition } from "react";
import {
  checkUsernameUniquenessAction,
  updateDateOfBirthAction,
  updateDefaultCurrencyAction,
  updateReservedWishesVisibilityAction,
  updateUsernameAction,
} from "~/services/user/actions";
import {
  DateOfBirthFormData,
  DefaultCurrencyFormData,
  ReservedWishesVisibilityFormData,
  UsernameFormData,
} from "~/services/user/formData";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/toastMessages";
import { Select } from "~/components/ui/select";
import { currencies, currencyNames } from "~/lib/currencies";
import { DAYS_IN_MONTHS, MONTHS } from "~/core/consts";
import { CheckIcon, StopwatchIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";

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
          <Link href="/api/auth/logout" className={buttonVariants({ variant: "secondary" })} prefetch={false}>
            <div className="flex items-center gap-2 no-underline">
              <SignOut size={16} />
              Sign out
            </div>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="pl-2">Email</Label>
        <Input type="text" name="email" value={user.email} disabled />
        <span className="pl-2 text-xs text-foreground/70">
          Email can not be changed for accounts signed with Google
        </span>
      </div>
      <Username username={user.username ?? ""} />
      <DateOfBirth day={user.dayOfBirth ?? undefined} month={user.monthOfBirth ?? undefined} />
      <DefaultCurrency currency={user.defaultCurrency ?? ""} />
      <ReservedWishesVisibility showReserved={user.showReserved ?? false} />
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

function Username({ username: initialValue }: { username: string }) {
  const router = useRouter();
  const [isUpdating, startUpdateTransition] = useTransition();

  const [isUnique, setIsUnique] = useState<boolean | undefined>(undefined);
  const [username, setUsername] = useState(initialValue);

  const deferredValue = useDeferredValue(username);

  const trigger = () => {
    if (username && isUnique) {
      startUpdateTransition(async () => {
        const { error } = await updateUsernameAction(UsernameFormData.fromObject({ username }));
        if (error) {
          showErrorToast(getErrorMessage(error));
        } else {
          router.refresh();
        }
      });
    }
  };

  const checkUniqueness = async (username: string) => {
    const { error, isUnique } = await checkUsernameUniquenessAction(UsernameFormData.fromObject({ username }));
    if (error) {
      showErrorToast(getErrorMessage(error));
    } else {
      setIsUnique(isUnique);
    }
  };

  useEffect(() => {
    if (deferredValue && deferredValue !== initialValue) {
      void checkUniqueness(deferredValue);
    }
  }, [deferredValue]);

  return (
    <div className="flex flex-col gap-2">
      <Label className="pl-2">Username</Label>
      <div className="flex items-center gap-4">
        <Input
          type="text"
          name="username"
          placeholder="e.g. macro-data-refiner"
          autoComplete="off"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className={clsx(isUnique === false && "border-destructive/70", isUnique === true && "border-emerald-500")}
        />
        {initialValue !== username && (
          <Button type="button" size="lg" onClick={trigger} disabled={!username || isUpdating}>
            Save
          </Button>
        )}
      </div>
    </div>
  );
}
