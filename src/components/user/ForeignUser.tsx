"use client";

import { OtherUser, User } from "~/services/user/types";
import { EmptyList } from "~/components/ui/emptyList";
import { WithStickyFooter } from "~/components/ui/scrollable";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { WishlistType } from "~/services/wishlist/types";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { ForeignWishesWishesDesktop, ForeignWishesWishesMobile } from "~/components/wishlist/foreign/ForeignWishes";
import { Button, buttonVariants } from "~/components/ui/button";
import { ArrowLeft, Cake } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { acceptFriendRequestAction, sendFriendRequestAction } from "~/services/friend/actions";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/errorMessages";
import { AddFriendButton } from "~/components/friends/AddFriendButton";
import { UserDetails } from "~/components/ui/user";
import { FriendDropdownMenu } from "~/components/friends/FriendDropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { DateTime } from "luxon";
import { Badge } from "~/components/ui/badge";
import { SignInButton } from "~/components/forms/SignInForm";
import Link from "next/link";
import { cn } from "~/utils/classnames";

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
      <MobileOnly className="h-full flex-col pb-4" display="flex">
        <ForeignUserMobile {...props} />
      </MobileOnly>
    </>
  );
}

function ForeignUserMobile({ wishlistOwner, wishlist, currentUser }: Props) {
  const { t } = useTranslation();
  return (
    <WithStickyFooter footer={<MobileFooter wishlistOwner={wishlistOwner} currentUser={currentUser} />}>
      <div className="flex h-full flex-col pb-4">
        <div className="sticky top-0 z-10 grid w-full grid-cols-[auto_max-content] items-center bg-background pr-4">
          <UserDetails
            user={wishlistOwner}
            context="wishlist"
            extraContent={
              wishlistOwner.hasPendingOutgoingFriendRequest && (
                <Badge className="mt-1.5 font-normal" variant="attention">
                  {t("friends.pendingFriendRequest")}
                </Badge>
              )
            }
          />
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

function MobileFooter({ wishlistOwner, currentUser }: Omit<Props, "wishlist">) {
  const [isPending, startTransition] = useTransition();

  const handleAcceptFriendRequest = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("friendId", wishlistOwner.id);

      const result = await acceptFriendRequestAction(formData);
      if (result.error) {
        showErrorToast(getErrorMessage(result.error, t));
      } else {
        router.refresh();
      }
    });
  };

  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromRoute = searchParams.get("from");

  if (!currentUser) return <SignInButton buttonVariant="default" />;

  if (wishlistOwner.hasPendingOutgoingFriendRequest) return null;

  if (wishlistOwner.isFriend && fromRoute === "friends") {
    return (
      <Button
        onClick={() => router.push(`/${currentUser?.username}/friends/your-friends`)}
        variant="outline"
        size="lg"
        className="mt-auto"
      >
        {t("actions.backToFriends")}
      </Button>
    );
  }

  if (wishlistOwner.hasPendingIncomingFriendRequest) {
    return (
      <Button onClick={handleAcceptFriendRequest} disabled={isPending} className="px-4">
        {t("actions.acceptFriendRequest")}
      </Button>
    );
  }

  return (
    <AddFriendButton friendId={wishlistOwner.id} currentUser={currentUser} friendUsername={wishlistOwner.username} />
  );
}

function ForeignUserDesktop({ wishlistOwner, wishlist, currentUser }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const searchParams = useSearchParams();
  const fromRoute = searchParams.get("from");

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

  const handleSendFriendRequest = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("friendId", wishlistOwner.id);

      const result = await sendFriendRequestAction(formData);
      if (result.error) {
        showErrorToast(getErrorMessage(result.error, t));
      } else {
        router.refresh();
      }
    });
  };

  const handleAcceptFriendRequest = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("friendId", wishlistOwner.id);

      const result = await acceptFriendRequestAction(formData);
      if (result.error) {
        showErrorToast(getErrorMessage(result.error, t));
      } else {
        router.refresh();
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
            {(wishlistOwner.isFriend && (fromRoute === "friends" || pathSegments[2] === "friends") && (
              <Link
                href={`/${currentUser.username}/friends/your-friends`}
                onClick={goToFriends}
                className={cn(buttonVariants({ variant: "ghost" }), "mb-4 flex items-center gap-2 px-2 no-underline")}
              >
                <ArrowLeft size={20} />
                {t("actions.backToFriends")}
              </Link>
            )) ||
              (wishlistOwner.hasPendingIncomingFriendRequest && fromRoute === "requests" && (
                <Link
                  href={`/${currentUser.username}/friends/requests`}
                  onClick={goToFriends}
                  className={cn(buttonVariants({ variant: "ghost" }), "mb-4 flex items-center gap-2 px-2 no-underline")}
                >
                  <ArrowLeft size={20} />
                  {t("actions.backToFriendRequests")}
                </Link>
              ))}
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
              {t("metadata.username.title", { username: wishlistOwner.username })}
            </h1>
            <div className="relative mt-6 flex w-fit items-start gap-10 rounded-xl border bg-background p-4 pr-8">
              <div className="flex items-start gap-4">
                <Avatar className="size-20">
                  <AvatarImage
                    src={wishlistOwner.image || ""}
                    alt={[wishlistOwner.firstName, wishlistOwner.lastName].join(" ")}
                  />
                  <AvatarFallback />
                </Avatar>
                <div className="mt-3">
                  <p className="flex scroll-m-20 items-start gap-2 text-2xl font-bold tracking-tight">
                    {[wishlistOwner.firstName, wishlistOwner.lastName].filter(Boolean).join(" ")}
                    {wishlistOwner.hasPendingOutgoingFriendRequest && (
                      <Badge className="mt-1.5 font-normal" variant="attention">
                        {t("friends.pendingFriendRequest")}
                      </Badge>
                    )}
                  </p>
                  <p className="flex items-center gap-2">
                    @{wishlistOwner.username}
                    {birthday && (
                      <Badge variant="birthday">
                        <Cake className="size-4" /> {birthday}
                      </Badge>
                    )}
                  </p>
                </div>
                {!wishlistOwner.hasPendingOutgoingFriendRequest && (
                  <div className="mt-3">
                    {wishlistOwner.isFriend ? (
                      <FriendDropdownMenu friendId={wishlistOwner.id} currentUser={currentUser} />
                    ) : wishlistOwner.hasPendingIncomingFriendRequest ? (
                      <Button size="sm" onClick={handleAcceptFriendRequest} disabled={isPending} className="px-4">
                        {t("actions.acceptFriendRequest")}
                      </Button>
                    ) : (
                      <Button size="sm" onClick={handleSendFriendRequest} disabled={isPending} className="px-4">
                        {t("actions.addFriend")}
                      </Button>
                    )}
                  </div>
                )}
              </div>
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
