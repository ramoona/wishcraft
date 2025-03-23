"use client";

import { Button } from "~/components/ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { addFriendAction, removeFriendAction } from "~/services/friend/actions";
import { useTranslation } from "react-i18next";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/errorMessages";

export function FriendActionButton({ friendId, isFriend }: { friendId: string; isFriend: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useTranslation();

  const handleFriendAction = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("friendId", friendId);

      let result;
      if (isFriend) {
        result = await removeFriendAction(formData);
      } else {
        result = await addFriendAction(formData);
      }
      if (result.error) {
        showErrorToast(getErrorMessage(result.error, t));
      }
      router.refresh();
    });
  };
  return (
    <Button onClick={handleFriendAction} variant={isFriend ? "tertiary" : "default"} size="lg" disabled={isPending}>
      {isFriend ? t("actions.removeFriend") : t("actions.addFriend")}
    </Button>
  );
}
