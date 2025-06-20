"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTransition } from "react";
import { removeFriendAction } from "~/services/friend/actions";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/errorMessages";
import { DropdownMenu, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import * as React from "react";
import { User } from "~/services/user/types";

export function FriendDropdownMenu({ friendId, currentUser }: { friendId: string; currentUser?: User | null }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const handleFriendAction = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("friendId", friendId);

      const result = await removeFriendAction(formData);
      if (result.error) {
        showErrorToast(getErrorMessage(result.error, t));
      }
      router.push(`/${currentUser?.username}/friends/your-friends`);
    });
  };

  return (
    <DropdownMenu ariaLabel="Friend menu">
      <DropdownMenuItem onSelect={handleFriendAction} className="min-w-48" disabled={isPending}>
        {t("actions.removeFriend")}
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
