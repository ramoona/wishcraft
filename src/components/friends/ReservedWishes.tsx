"use client";

import { FriendUser, OtherUser, User } from "~/services/user/types";
import { EmptyList } from "~/components/ui/emptyList";
import { WithStickyFooter } from "~/components/ui/scrollable";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { WishType } from "~/services/wishlist/types";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { TabButton } from "~/components/ui/tab-button";
import { ForeignWishesWishesDesktop, ForeignWishesWishesMobile } from "~/components/wishlist/foreign/ForeignWishes";
import { Badge } from "~/components/ui/badge";

type Props = {
  reservedWishes: (WishType & { user: Pick<OtherUser, "username"> })[];
  user: User;
  friendRequests: FriendUser[];
};

export function ReservedWishesList(props: Props) {
  return (
    <>
      <DesktopOnly>
        <ReservedWishesDesktop {...props} />
      </DesktopOnly>
      <MobileOnly className="flex-col" display="flex">
        <ReservedWishesMobile {...props} />
      </MobileOnly>
    </>
  );
}

function ReservedWishesMobile({ reservedWishes, user, friendRequests }: Props) {
  const { t } = useTranslation();
  return (
    <WithStickyFooter footer={null}>
      <div className="flex size-full flex-col">
        <div className="sticky top-0 z-10 mx-auto flex w-full max-w-[100vw] items-center justify-center overflow-x-auto border-b border-b-muted bg-background px-4 py-5 sm:border-b-0">
          <TabButton route={`/${user.username}/friends/your-friends`}>{t("friends.tabs.friendsMobile")}</TabButton>
          <TabButton route={`/${user.username}/friends/requests`}>
            {t("friends.tabs.requests")}
            {friendRequests.length > 0 && <Badge className="ml-2 px-2">{friendRequests.length}</Badge>}
          </TabButton>
          <TabButton isActive route={`/${user.username}/friends/reserved-wishes`}>
            {t("friends.tabs.reservedWishes")}
          </TabButton>
        </div>
        <div className="mx-auto flex w-full max-w-lg grow flex-col bg-muted p-4 shadow-[0_-10px_0_5px_#fff] sm:rounded">
          <p className="mb-4 w-full text-center text-xs lg:mt-2 lg:text-left">{t("friends.reservedWishedSubtitle")}</p>
          {reservedWishes.length > 0 ? (
            <ForeignWishesWishesMobile wishes={reservedWishes} currentUser={user} />
          ) : (
            <EmptyList shape="3" />
          )}
        </div>
      </div>
    </WithStickyFooter>
  );
}

function ReservedWishesDesktop({ reservedWishes, user }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <div className="my-8">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{t("friends.tabs.reservedWishesTitle")}</h1>
        <p className="mb-4 w-full text-center text-xs lg:mt-2 lg:text-left">{t("friends.reservedWishedSubtitle")}</p>
      </div>
      {reservedWishes.length > 0 ? (
        <ForeignWishesWishesDesktop wishes={reservedWishes} currentUser={user} />
      ) : (
        <EmptyList shape="4" />
      )}
    </>
  );
}
