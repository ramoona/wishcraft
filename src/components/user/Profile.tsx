"use client";

import { User } from "~/services/user/types";
import { SignOut } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";

export function Profile({ user }: { user: User }) {
  return (
    <div>
      <div>
        <UserPic imageUrl={user.image} />
        <div className="text-lg font-bold">{user.username}</div>
      </div>
      <Link href="/api/auth/logout">
        <div className="flex items-center gap-2 no-underline">
          <SignOut size={24} />
          Sign out
        </div>
      </Link>
    </div>
  );
}

function UserPic({ imageUrl }: { imageUrl?: string | null }) {
  return (
    <Avatar>
      <AvatarImage src={imageUrl || ""} />
      <AvatarFallback />
    </Avatar>
  );
}
