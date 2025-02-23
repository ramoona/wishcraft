"use client";
import { User } from "~/services/user/types";
import { SignOut } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { DateTime } from "luxon";
import { Switch } from "~/components/ui/switch";
import { buttonVariants } from "~/components/ui/button";

export function Profile({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="items-top flex gap-4">
        <UserPic imageUrl={user.image} />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-lg">
            <span>{[user.firstName, user.lastName].filter(Boolean).join(" ")}</span>
            <span className="text-sm text-foreground/70">@{user.username}</span>
          </div>
          <Link href="/api/auth/logout" className={buttonVariants({ variant: "secondary" })}>
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
      <div className="flex flex-col gap-2">
        <Label className="pl-2">Username</Label>
        <Input type="text" name="username" value={user.username || ""} />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="pl-2">Day of Birth</Label>
        <Input
          type="text"
          name="day-of-birth"
          value={
            user.dayOfBirth && user.monthOfBirth
              ? DateTime.fromObject({ day: user.dayOfBirth, month: user.monthOfBirth }).toFormat("LLLL dd")
              : "Not Set"
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="pl-2">Default Currency</Label>
        <Input type="text" name="curency" value={user.defaultCurrency || "Not Set"} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Label className="pl-2">Show reservation status</Label>
          <div className="pl-2 text-sm text-foreground/70">
            For your wished you will see <span className="font-semibold">reserved</span> status but not who reserved it.
          </div>
        </div>
        <Switch checked={user.showReserved ?? false} />
      </div>
    </div>
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
