"use client";

import { Button } from "~/components/ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { addFriendAction, removeFriendAction } from "~/services/friend/actions";
import { showToastWithActionResult } from "~/core/showToastWithActionResult";
import { useTranslation } from "~/utils/useTranslation";

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
        showToastWithActionResult(result.error);
      }
      router.refresh();
    });
  };
  return (
    <Button onClick={handleFriendAction} disabled={isPending}>
      {isFriend ? t("actions.removeFriend") : t("actions.addFriend")}
    </Button>
  );
}
