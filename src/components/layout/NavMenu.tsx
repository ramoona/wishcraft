"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OtherUser, User } from "~/services/user/types";
import { cn } from "~/utils/classnames";
import { useTranslation } from "react-i18next";

const navItems: { label: string; route: string }[] = [
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

export default function NavMenu({ user, otherUser }: { user: User; otherUser?: OtherUser }) {
  const pathname = usePathname();
  const route = pathname.split("/")[2];
  const { t } = useTranslation();

  return (
    <nav className="flex items-center gap-14">
      {navItems.map(item => {
        const isSelected = route === item.route || (item.route === "friends" && otherUser?.isFriend);
        return (
          <Link
            key={item.route}
            href={`/${user.username}/${item.route}`}
            className={cn(
              "flex items-center justify-center gap-1 font-medium text-stone-500 no-underline ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isSelected && "text-black underline",
            )}
          >
            {t(item.label)}
          </Link>
        );
      })}
    </nav>
  );
}
