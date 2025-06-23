"use client";

import { FriendUser, User } from "~/services/user/types";
import { EmptyList } from "~/components/ui/emptyList";
import { WithStickyFooter } from "~/components/ui/scrollable";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { TabButton } from "~/components/ui/tab-button";
import { cn } from "~/utils/classnames";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useTransition } from "react";
import { acceptFriendRequestAction, declineFriendRequestAction } from "~/services/friend/actions";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/errorMessages";
import { useRouter } from "next/navigation";
import { Badge } from "~/components/ui/badge";

type Props = {
  friendRequests: FriendUser[];
  user: User;
};

export function FriendsRequestsList(props: Props) {
  return (
    <>
      <DesktopOnly>
        <FriendsListDesktop {...props} />
      </DesktopOnly>
      <MobileOnly className="flex-col" display="flex">
        <FriendsListMobile {...props} />
      </MobileOnly>
    </>
  );
}

function FriendsListMobile({ friendRequests, user }: Props) {
  const { t } = useTranslation();
  return (
    <WithStickyFooter footer={null}>
      <div className="flex size-full flex-col">
        <div className="sticky top-0 z-10 mx-auto flex w-full max-w-[100vw] items-center justify-center overflow-x-auto border-b border-b-muted bg-background px-4 py-5 sm:border-b-0">
          <TabButton route={`/${user.username}/friends/your-friends`}>{t("friends.tabs.friendsMobile")}</TabButton>
          <TabButton isActive route={`/${user.username}/friends/requests`} withCount={friendRequests.length > 0}>
            {t("friends.tabs.requests")}
            {friendRequests.length > 0 && <Badge className="ml-2 px-2">{friendRequests.length}</Badge>}
          </TabButton>
          <TabButton route={`/${user.username}/friends/reserved-wishes`}>{t("friends.tabs.reservedWishes")}</TabButton>
        </div>
        <div className="mx-auto flex w-full max-w-lg grow flex-col bg-muted p-4 shadow-[0_-10px_0_5px_#fff] sm:rounded">
          <p className="mb-4 w-full text-center text-xs lg:mt-2 lg:text-left">{t("friends.subtitle")}</p>
          {friendRequests.length > 0 ? (
            <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pb-4">
              <FriendRequests friendRequests={friendRequests} />
            </div>
          ) : (
            <EmptyList shape="2" />
          )}
        </div>
      </div>
    </WithStickyFooter>
  );
}

function FriendsListDesktop({ friendRequests }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <div className="my-8">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{t("friends.requestsTitle")}</h1>
        <p className="mb-4 w-full text-center text-xs lg:mt-2 lg:text-left">{t("friends.requestsSubtitle")}</p>
      </div>
      {friendRequests.length > 0 ? (
        <div className={cn("mb-8 flex w-full max-w-lg flex-col flex-wrap items-start gap-4 pr-8")}>
          <FriendRequests friendRequests={friendRequests} />
        </div>
      ) : (
        <EmptyList shape="2" />
      )}
    </>
  );
}

function FriendRequests({ friendRequests }: Omit<Props, "user">) {
  const router = useRouter();
  const { t } = useTranslation();

  const [isPendingAccept, startAcceptTransition] = useTransition();
  const [isPendingDecline, startDeclineTransition] = useTransition();

  const handleAcceptFriendRequest = (id: string) => {
    startAcceptTransition(async () => {
      const formData = new FormData();
      formData.append("friendId", id);

      const result = await acceptFriendRequestAction(formData);
      if (result.error) {
        showErrorToast(getErrorMessage(result.error, t));
      } else {
        router.refresh();
      }
    });
  };

  const handleDeclineFriendRequest = (id: string) => {
    startDeclineTransition(async () => {
      const formData = new FormData();
      formData.append("friendId", id);

      const result = await declineFriendRequestAction(formData);
      if (result.error) {
        showErrorToast(getErrorMessage(result.error, t));
      } else {
        router.refresh();
      }
    });
  };
  return friendRequests.map(user => (
    <div
      key={user.id}
      className={cn(
        "flex max-w-lg items-center gap-2 rounded bg-background p-4 lg:min-w-[500px] lg:rounded-xl lg:border",
      )}
    >
      <Avatar className="size-10 lg:size-12">
        <AvatarImage src={user.image || ""} alt={[user.firstName, user.lastName].join(" ")} />
        <AvatarFallback />
      </Avatar>
      <div className="flex grow flex-col">
        <Link href={`/${user.username}`} className="mt-1 text-sm text-foreground/70">
          @{user.username}
        </Link>
        <span className={cn("flex items-center gap-1")}>
          <span className="flex flex-col text-sm">
            <span>{[user.firstName, user.lastName].filter(Boolean).join(" ")} </span>
          </span>
        </span>
      </div>
      <div className="flex flex-col items-center gap-2 lg:flex-row">
        <Button
          size="sm"
          className="px-4"
          disabled={isPendingDecline}
          isLoading={isPendingAccept}
          onClick={() => handleAcceptFriendRequest(user.id)}
          minWidth={false}
          fullWidth
        >
          {t("actions.accept")}
        </Button>
        <Button
          size="sm"
          className="px-4"
          variant="tertiary"
          disabled={isPendingAccept}
          isLoading={isPendingDecline}
          onClick={() => handleDeclineFriendRequest(user.id)}
          minWidth={false}
          fullWidth
        >
          {t("actions.decline")}
        </Button>
      </div>
    </div>
  ));
}
