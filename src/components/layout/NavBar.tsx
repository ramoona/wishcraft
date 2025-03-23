"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OtherUser, User } from "~/services/user/types";
import { cn } from "~/utils/classnames";
import { useTranslation } from "react-i18next";
import * as React from "react";

const navItems = [
  {
    label: "navigation.wishes",
    route: "wishes",
  },
  {
    label: "navigation.friends",
    route: "friends",
  },
  {
    label: "navigation.profile",
    route: "profile",
  },
];

export default function NavBar({ user, otherUser }: { user: User; otherUser?: OtherUser }) {
  const pathname = usePathname();
  const route = pathname.split("/")[2];
  const { t } = useTranslation();

  return (
    <nav className="relative w-full bg-background">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-around">
        {navItems.map(item => (
          <Link
            key={item.route}
            href={`/${user.username}/${item.route}`}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-sm no-underline",
              (route === item.route || (item.route === "friends" && otherUser?.isFriend)) && "font-semibold",
            )}
          >
            {t(item.label)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
