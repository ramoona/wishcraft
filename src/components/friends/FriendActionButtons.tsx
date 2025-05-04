"use client";

import { Button } from "~/components/ui/button";
import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { addFriendAction, removeFriendAction } from "~/services/friend/actions";
import { useTranslation } from "react-i18next";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/errorMessages";

export function FriendActionButtons({ friendId, isFriend }: { friendId: string; isFriend: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
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
    <div className="my-4 mt-auto px-4">
      <div className="mx-auto grid w-full max-w-lg grid-cols-[1fr_2fr] items-center gap-4 px-4">
        <Button
          onClick={() => router.push(`${pathname}/friends`)}
          variant="outline"
          size="lg"
          minWidth={false}
          fullWidth
        >
          Back
        </Button>
        <Button
          onClick={handleFriendAction}
          variant={isFriend ? "tertiary" : "default"}
          size="lg"
          disabled={isPending}
          minWidth={false}
          fullWidth
        >
          {isFriend ? t("actions.removeFriend") : t("actions.addFriend")}
        </Button>
      </div>
    </div>
  );
}
