"use client";

import { Button } from "~/components/ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendFriendRequestAction } from "~/services/friend/actions";
import { useTranslation } from "react-i18next";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/error-messages";
import { User } from "~/services/user/types";

export function AddFriendButton({
  friendId,
  currentUser,
  friendUsername,
}: {
  friendId: string;
  currentUser?: User | null;
  friendUsername: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useTranslation();

  const handleFriendAction = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("friendId", friendId);

      const result = await sendFriendRequestAction(formData);
      if (result.error) {
        showErrorToast(getErrorMessage(result.error, t));
      }
      router.push(`/${currentUser?.username}/friends/your-friends/${friendUsername}`);
    });
  };
  return (
    <Button onClick={handleFriendAction} size="lg" disabled={isPending}>
      {t("actions.addFriend")}
    </Button>
  );
}
