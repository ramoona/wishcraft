"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OtherUser, User } from "~/services/user/types";
import { cn } from "~/utils/classnames";
import { AddNewWishMobile } from "~/components/wishlist/own/AddNewWish";
import { useTranslation } from "~/utils/useTranslation";
import { FriendActionButton } from "~/components/friends/FriendActionButton";

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
      {route === "wishes" && <AddNewWishMobile />}
      {otherUser && <FriendActionButton friendId={otherUser.id} isFriend={otherUser.isFriend} />}
      <div className="mx-auto flex h-14 max-w-xl items-center justify-around">
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
