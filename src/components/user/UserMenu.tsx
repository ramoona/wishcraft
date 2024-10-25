"use client";

import { User } from "~/services/user/types";
import { DropdownMenu, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { SignOut, UserCircle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export function UserMenu({ user }: { user: User }) {
  const router = useRouter();

  return (
    <DropdownMenu
      trigger={
        user.image ? (
          <img className="size-8 rounded-full border" src={user.image} alt="User image" />
        ) : (
          <span className="rounded-full bg-stone-200">
            <UserCircle size={32} className="fill-stone-500" />
          </span>
        )
      }
    >
      <DropdownMenuItem onClick={() => router.push("/api/auth/logout")}>
        <div className="flex items-center gap-2 no-underline">
          <SignOut size={24} />
          Sign out
        </div>
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
