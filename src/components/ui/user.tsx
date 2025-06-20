"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { User } from "~/services/user/types";
import { Badge } from "~/components/ui/badge";
import { Cake } from "@phosphor-icons/react";
import { cn } from "~/utils/classnames";
import { useTranslation } from "react-i18next";
import { DateTime } from "luxon";
import { usePathname } from "next/navigation";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";

const container = cva("rounded bg-background no-underline", {
  variants: {
    sticky: {
      true: "sticky top-0 z-10",
    },
    context: {
      friends: "lg:rounded-xl lg:border",
      profile: "",
      wishlist: "",
      sidebar: "",
    },
    link: {
      true: "transition-colors duration-200 hover:border-primary hover:ring-1 focus-visible:outline-none hover:ring-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
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
  context: "friends" | "profile" | "wishlist" | "sidebar";
}) {
  const daysUntilBirthday = getDaysUntilBirthday(user);
  const { t, i18n } = useTranslation();
  const pathname = usePathname();

  const birthday =
    user.dayOfBirth && user.monthOfBirth
      ? DateTime.fromObject({ day: user.dayOfBirth, month: user.monthOfBirth })
          .setLocale(i18n.language)
          .toLocaleString({ month: "long", day: "2-digit" })
      : null;

  const content = (
    <>
      <div className={cn("mx-auto flex max-w-lg items-start gap-4 rounded p-4", context === "sidebar" && "p-0")}>
        <Avatar className="size-16">
          <AvatarImage src={user.image || ""} />
          <AvatarFallback />
        </Avatar>
        <div className="flex grow flex-col">
          <span className="mt-1 text-sm text-foreground/70">@{user.username}</span>
          <span className={cn("flex items-center gap-1", context === "friends" && "justify-between")}>
            <span className="flex flex-col text-sm">
              <span>{[user.firstName, user.lastName].filter(Boolean).join(" ")} </span>
              {email && <span className="text-xs text-foreground/70">{email}</span>}
            </span>
            {context === "friends" && daysUntilBirthday && daysUntilBirthday < 31 && (
              <Badge variant="birthday">{t("friends.birthdayIn", { count: daysUntilBirthday })}</Badge>
            )}
            {context === "wishlist" && birthday && (
              <Badge variant="birthday">
                <Cake className="size-4" /> {birthday}
              </Badge>
            )}
          </span>
          {extraContent && <MobileOnly>{extraContent}</MobileOnly>}
        </div>
      </div>
      {extraContent && <DesktopOnly className="px-4 pb-4">{extraContent}</DesktopOnly>}
    </>
  );

  if (isLink) {
    return (
      <Link href={`${pathname}/${user.username}`} className={container({ sticky, context, link: true })}>
        {content}
      </Link>
    );
  }

  return <div className={container({ sticky, context })}>{content}</div>;
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
