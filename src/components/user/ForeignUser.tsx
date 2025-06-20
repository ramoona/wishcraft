"use client";

import { OtherUser, User } from "~/services/user/types";
import { EmptyList } from "~/components/ui/emptyList";
import { WithStickyFooter } from "~/components/ui/scrollable";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { WishlistType } from "~/services/wishlist/types";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { ForeignWishesWishesDesktop, ForeignWishesWishesMobile } from "~/components/wishlist/foreign/ForeignWishes";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { addFriendAction, removeFriendAction } from "~/services/friend/actions";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/errorMessages";
import { AddFriendButton } from "~/components/friends/AddFriendButton";
import { UserDetails } from "~/components/ui/user";
import { FriendDropdownMenu } from "~/components/friends/FriendDropdownMenu";

type Props = {
  wishlistOwner: OtherUser;
  currentUser?: User | null;
  wishlist: WishlistType;
};

export function ForeignUser(props: Props) {
  return (
    <>
      <DesktopOnly>
        <ForeignUserDesktop {...props} />
      </DesktopOnly>
      <MobileOnly className="flex-col" display="flex">
        <ForeignUserMobile {...props} />
      </MobileOnly>
    </>
  );
}

function ForeignUserMobile({ wishlistOwner, wishlist, currentUser }: Props) {
  const router = useRouter();
  const { t } = useTranslation();

  const footer =
    (currentUser && wishlistOwner.isFriend && (
      <Button
        onClick={() => router.push(`/${currentUser?.username}/friends/your-friends`)}
        variant="outline"
        size="lg"
        className="mt-auto"
      >
        {t("actions.backToFriends")}
      </Button>
    )) ||
    (currentUser && !wishlistOwner.isFriend && (
      <AddFriendButton friendId={wishlistOwner.id} currentUser={currentUser} friendUsername={wishlistOwner.username} />
    )) ||
    null;

  return (
    <WithStickyFooter footer={footer}>
      <div className="flex h-full flex-col pb-4">
        <div className="sticky top-0 z-10 grid w-full grid-cols-[auto_max-content] items-center bg-background pr-4">
          <UserDetails user={wishlistOwner} context="wishlist" />
          {currentUser && wishlistOwner.isFriend && (
            <FriendDropdownMenu friendId={wishlistOwner.id} currentUser={currentUser} />
          )}
        </div>
        <div className="mx-auto flex w-full max-w-lg grow flex-col bg-muted p-4 shadow-[0_-10px_0_5px_#fff] sm:rounded">
          {wishlist.wishes.length > 0 ? (
            <ForeignWishesWishesMobile wishes={wishlist.wishes} currentUser={currentUser} />
          ) : (
            <EmptyList shape="3" />
          )}
        </div>
      </div>
    </WithStickyFooter>
  );
}

function ForeignUserDesktop({ wishlistOwner, wishlist, currentUser }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRemoveFriendAction = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("friendId", wishlistOwner.id);

      const result = await removeFriendAction(formData);
      if (result.error) {
        showErrorToast(getErrorMessage(result.error, t));
      }
      router.push(`/${currentUser?.username}/friends/your-friends`);
    });
  };

  const handleAddFriendAction = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("friendId", wishlistOwner.id);

      const result = await addFriendAction(formData);
      if (result.error) {
        showErrorToast(getErrorMessage(result.error, t));
      }
      router.push(`/${currentUser?.username}/friends/your-friends/${wishlistOwner.username}`);
    });
  };

  return (
    <>
      <div className="mb-8 mt-10">
        <div className="relative flex items-center gap-3">
          {currentUser && wishlistOwner.isFriend && (
            <Button variant="ghost" onClick={() => router.back()} className="px-2">
              <ArrowLeft size={20} />
            </Button>
          )}
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">@{wishlistOwner.username}</h1>
          {currentUser &&
            (wishlistOwner.isFriend ? (
              <Button size="xs" variant="tertiary" onClick={handleRemoveFriendAction} disabled={isPending}>
                {t("actions.removeFriend")}
              </Button>
            ) : (
              <Button size="xs" onClick={handleAddFriendAction} disabled={isPending}>
                {t("actions.addFriend")}
              </Button>
            ))}
        </div>
      </div>
      {wishlist.wishes.length > 0 ? (
        <ForeignWishesWishesDesktop currentUser={currentUser} wishes={wishlist.wishes} />
      ) : (
        <EmptyList shape="4" />
      )}
    </>
  );
}
