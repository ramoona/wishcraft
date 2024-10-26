"use client";

import { User } from "~/services/user/types";
import { DropdownMenu, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { SignOut } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export function UserMenu({ user }: { user: User }) {
  const router = useRouter();

  return (
    <DropdownMenu
      trigger={
        <div className="flex items-center gap-2">
          <UserPic
            imageUrl={user.image}
            userInitials={`${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`}
          />
        </div>
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

function UserPic({ imageUrl, userInitials }: { imageUrl?: string | null; userInitials: string }) {
  return (
    <Avatar>
      <AvatarImage src={imageUrl || ""} />
      <AvatarFallback>{userInitials}</AvatarFallback>
    </Avatar>
  );
}
