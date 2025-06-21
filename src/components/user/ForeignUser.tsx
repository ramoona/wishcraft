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
import { ArrowLeft, Cake } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { addFriendAction, removeFriendAction } from "~/services/friend/actions";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/errorMessages";
import { AddFriendButton } from "~/components/friends/AddFriendButton";
import { UserDetails } from "~/components/ui/user";
import { FriendDropdownMenu } from "~/components/friends/FriendDropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { DateTime } from "luxon";
import { Badge } from "~/components/ui/badge";
import { SignInButton } from "~/components/forms/SignInForm";

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
      <MobileOnly className="h-full flex-col" display="flex">
        <ForeignUserMobile {...props} />
      </MobileOnly>
    </>
  );
}

function ForeignUserMobile({ wishlistOwner, wishlist, currentUser }: Props) {
  const router = useRouter();
  const { t } = useTranslation();

  const footer = (currentUser &&
    (wishlistOwner.isFriend ? (
      <Button
        onClick={() => router.push(`/${currentUser?.username}/friends/your-friends`)}
        variant="outline"
        size="lg"
        className="mt-auto"
      >
        {t("actions.backToFriends")}
      </Button>
    ) : (
      <AddFriendButton friendId={wishlistOwner.id} currentUser={currentUser} friendUsername={wishlistOwner.username} />
    ))) || <SignInButton buttonVariant="default" />;

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { t, i18n } = useTranslation();

  const birthday =
    wishlistOwner.dayOfBirth && wishlistOwner.monthOfBirth
      ? DateTime.fromObject({ day: wishlistOwner.dayOfBirth, month: wishlistOwner.monthOfBirth })
          .setLocale(i18n.language)
          .toLocaleString({ month: "long", day: "2-digit" })
      : null;

  const goToFriends = () => {
    if (currentUser) {
      router.push(`/${currentUser.username}/friends/your-friends`);
    }
  };

  const handleRemoveFriendAction = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("friendId", wishlistOwner.id);

      const result = await removeFriendAction(formData);
      if (result.error) {
        showErrorToast(getErrorMessage(result.error, t));
      }
      goToFriends();
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

      if (currentUser) {
        router.push(`/${currentUser.username}/friends/your-friends/${wishlistOwner.username}`);
      }
    });
  };

  return (
    <>
      <div className="my-8 pr-8">
        {!currentUser && (
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            {t("metadata.username.title", { username: wishlistOwner.username })}
          </h1>
        )}
        {currentUser && (
          <>
            {wishlistOwner.isFriend && (
              <Button variant="ghost" onClick={goToFriends} className="mb-4 flex items-center gap-2 px-2">
                <ArrowLeft size={20} />
                {t("actions.backToFriends")}
              </Button>
            )}
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
              {t("metadata.username.title", { username: wishlistOwner.username })}
            </h1>
            <div className="relative mt-6 flex w-fit items-start gap-10 rounded-xl border bg-background p-4 pr-8">
              <div className="flex items-center gap-4">
                <Avatar className="size-20">
                  <AvatarImage
                    src={wishlistOwner.image || ""}
                    alt={[wishlistOwner.firstName, wishlistOwner.lastName].join(" ")}
                  />
                  <AvatarFallback />
                </Avatar>
                <div>
                  <h1 className="scroll-m-20 text-2xl font-bold tracking-tight">
                    {[wishlistOwner.firstName, wishlistOwner.lastName].filter(Boolean).join(" ")}
                  </h1>
                  <p className="mt-1 flex items-center gap-2">
                    @{wishlistOwner.username}
                    {birthday && (
                      <Badge variant="birthday">
                        <Cake className="size-4" /> {birthday}
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
              <Button
                size="xs"
                variant={wishlistOwner.isFriend ? "tertiary" : "default"}
                onClick={wishlistOwner.isFriend ? handleRemoveFriendAction : handleAddFriendAction}
                disabled={isPending}
                className="mt-4"
              >
                {wishlistOwner.isFriend ? t("actions.removeFriend") : t("actions.addFriend")}
              </Button>
            </div>
          </>
        )}
      </div>
      {wishlist.wishes.length > 0 ? (
        <ForeignWishesWishesDesktop currentUser={currentUser} wishes={wishlist.wishes} />
      ) : (
        <EmptyList shape="4" />
      )}
    </>
  );
}
