"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "~/services/user/types";
import { cn } from "~/utils/classnames";

const navItems = [
  {
    label: "Wishes",
    route: "wishes",
  },
  {
    label: "Friends",
    route: "friends",
  },
  {
    label: "Profile",
    route: "profile",
  },
];

export default function NavBar({ user }: { user: User }) {
  const pathname = usePathname();
  const route = pathname.split("/")[2];

  return (
    <nav className="z-10 flex h-14 w-full items-center justify-around border-t bg-background">
      {navItems.map(item => (
        <Link
          key={item.route}
          href={`/${user.username}/${item.route}`}
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground no-underline hover:text-primary focus:text-primary",
            route === item.route && "font-bold",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
