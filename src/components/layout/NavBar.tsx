"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "~/services/user/types";
import { cn } from "~/utils/classnames";
import { AddNewWishMobile } from "~/components/wishlist/own/AddNewWish";
import { useTranslation } from "~/utils/useTranslation";

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

export default function NavBar({ user }: { user: User }) {
  const pathname = usePathname();
  const route = pathname.split("/")[2];
  const { t } = useTranslation();

  return (
    <nav className="relative flex h-14 w-full items-center justify-around border-t bg-background">
      {route === "wishes" && <AddNewWishMobile />}
      {navItems.map(item => (
        <Link
          key={item.route}
          href={`/${user.username}/${item.route}`}
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground no-underline hover:text-primary focus:text-primary",
            route === item.route && "font-bold",
          )}
        >
          {t(item.label)}
        </Link>
      ))}
    </nav>
  );
}
