"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OtherUser, User } from "~/services/user/types";
import { cn } from "~/utils/classnames";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { FunctionComponent } from "react";

const navItems: { label: string; route: string; icon: FunctionComponent<{ className?: string; fill?: string }> }[] = [
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

export default function NavBar({ user, otherUser }: { user: User; otherUser?: OtherUser }) {
  const pathname = usePathname();
  const route = pathname.split("/")[2];
  const { t } = useTranslation();

  return (
    <nav className="sticky bottom-0 h-20 w-full bg-background">
      <div className="mx-auto flex h-full max-w-lg items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isSelected = route === item.route || (item.route === "friends" && otherUser?.isFriend);
          return (
            <Link
              key={item.route}
              href={`/${user.username}/${item.route}`}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded text-sm font-medium text-stone-500 no-underline ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected && "text-black",
              )}
            >
              <Icon fill={isSelected ? "fill-black" : "fill-active"} />
              {t(item.label)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function WishesIcon({ fill }: { fill?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="size-5">
      <path
        className={fill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.465 1.161a1.517 1.517 0 0 1 2.945-.022c1.015 3.927 3.492 6.368 7.43 7.323a1.52 1.52 0 0 1 .02 2.95c-3.92 1.012-6.358 3.489-7.315 7.429a1.518 1.518 0 0 1-2.945.022c-1.015-3.927-3.492-6.368-7.43-7.323a1.52 1.52 0 0 1-.025-2.95C5.07 7.579 7.51 5.102 8.465 1.16Z"
      />
    </svg>
  );
}

function FriendsIcon({ fill }: { fill?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="size-5">
      <path
        className={fill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.54 1.332a1.98 1.98 0 0 1 2.955.012 4.456 4.456 0 0 0 3.735 1.57 1.974 1.974 0 0 1 2.075 2.077 4.494 4.494 0 0 0 1.555 3.78 1.959 1.959 0 0 1-.015 2.926 4.41 4.41 0 0 0-1.56 3.726 1.971 1.971 0 0 1-2.1 2.07A4.368 4.368 0 0 0 11.48 19a1.986 1.986 0 0 1-2.96-.011 4.45 4.45 0 0 0-3.735-1.571 1.967 1.967 0 0 1-2.07-2.077 4.493 4.493 0 0 0-1.555-3.78 1.958 1.958 0 0 1 .015-2.926A4.408 4.408 0 0 0 2.73 4.911a1.971 1.971 0 0 1 2.1-2.07 4.372 4.372 0 0 0 3.71-1.51Z"
      />
    </svg>
  );
}

function ProfileIcon({ fill }: { fill?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="size-5">
      <path
        className={fill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.38 18.455H.555A9.404 9.404 0 0 1 7.825 9.3a4.353 4.353 0 1 1 4.38.025 9.405 9.405 0 0 1 7.175 9.13Z"
      />
    </svg>
  );
}
