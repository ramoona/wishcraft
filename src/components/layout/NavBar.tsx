"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "~/services/user/types";
import { cn } from "~/utils/classnames";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { FunctionComponent } from "react";
import { Badge } from "~/components/ui/badge";
import { WishesIcon } from "~/components/ui/icons/WishesIcon";
import { FriendsIcon } from "~/components/ui/icons/FriendsIcon";
import { ProfileIcon } from "~/components/ui/icons/ProfileIcon";

const navItems: { label: string; route: string; icon: FunctionComponent<{ isSelected?: boolean }> }[] = [
  {
    label: "navigation.wishes",
    route: "wishes",
    icon: WishesIcon,
  },
  {
    label: "navigation.friends",
    route: "friends",
    icon: FriendsIcon,
  },
  {
    label: "navigation.profile",
    route: "profile",
    icon: ProfileIcon,
  },
];

export default function NavBar({ user, friendRequestsCount }: { user: User; friendRequestsCount: number }) {
  const pathname = usePathname();
  const route = pathname.split("/")[2];
  const { t } = useTranslation();

  return (
    <nav className="sticky bottom-0 h-20 w-full border-t border-t-muted bg-background sm:border-t-0">
      <div className="mx-auto flex h-full max-w-lg items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isSelected = route === item.route;
          return (
            <Link
              key={item.route}
              href={`/${user.username}/${item.route}`}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded text-sm font-medium text-stone-500 no-underline ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                isSelected && "text-black",
              )}
            >
              <Icon isSelected={isSelected} />
              <div className="flex items-center gap-1">
                {t(item.label)}
                {item.route === "friends" && friendRequestsCount > 0 && (
                  <Badge className="px-2">{friendRequestsCount}</Badge>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
