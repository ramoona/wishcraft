"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { User } from "~/services/user/types";
import { Badge } from "~/components/ui/badge";
import { MONTHS } from "~/core/consts";
import { Cake } from "@phosphor-icons/react";
import { cn } from "~/utils/classnames";

const container = cva("rounded bg-background no-underline", {
  variants: {
    sticky: {
      true: "sticky top-0 z-10",
    },
  },
});

export function UserDetails({
  user,
  extraContent,
  isLink,
  email,
  sticky,
  context,
}: {
  user: Pick<User, "username" | "firstName" | "lastName" | "image" | "dayOfBirth" | "monthOfBirth">;
  extraContent?: React.ReactNode;
  isLink?: boolean;
  email?: string;
  sticky?: boolean;
  context: "friends" | "profile" | "wishlist";
}) {
  const daysUntilBirthday = getDaysUntilBirthday(user);
  const content = (
    <div className="mx-auto flex max-w-lg items-center gap-4 p-4">
      <Avatar className="size-16">
        <AvatarImage src={user.image || ""} />
        <AvatarFallback />
      </Avatar>
      <div className="flex grow flex-col">
        <span className="text-sm text-foreground/70">@{user.username}</span>
        <span className={cn("flex items-center gap-1", context === "friends" && "justify-between")}>
          <span className="text-sm">
            {[user.firstName, user.lastName].filter(Boolean).join(" ")}{" "}
            {email ? <span className="text-xs text-foreground/70">{`(${email})`}</span> : ""}
          </span>
          {context === "friends" && daysUntilBirthday && daysUntilBirthday < 31 && (
            <Badge variant="birthday">
              Birthday in {daysUntilBirthday} {daysUntilBirthday === 1 ? "day" : "days"}
            </Badge>
          )}
          {context === "wishlist" && user.monthOfBirth && user.dayOfBirth && (
            <Badge variant="birthday">
              <Cake className="size-4" /> {MONTHS[user.monthOfBirth - 1]} {user.dayOfBirth}
            </Badge>
          )}
        </span>
        {extraContent}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link href={`/${user.username}`} className={container({ sticky })}>
        {content}
      </Link>
    );
  }

  return <div className={container({ sticky })}>{content}</div>;
}

function getDaysUntilBirthday(user: Pick<User, "dayOfBirth" | "monthOfBirth">): null | number {
  const { dayOfBirth, monthOfBirth } = user;

  if (!dayOfBirth || !monthOfBirth) {
    return null;
  }

  const now = new Date();
  const birthday = new Date(new Date().getFullYear(), monthOfBirth - 1, dayOfBirth, 0, 0, 0, 0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const daysUntilBirthday = Math.max(0, Math.floor((birthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  return daysUntilBirthday || null;
}
