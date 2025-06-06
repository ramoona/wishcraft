"use client";

import { FriendUser, OtherUser } from "~/services/user/types";
import { UserDetails } from "~/components/ui/user";
import { EmptyList } from "~/components/ui/emptyList";
import { WithStickyFooter } from "~/components/ui/scrollable";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WishlistItems } from "~/components/wishlist/WishlistItems";
import { WishDetails } from "~/components/wishlist/WishDetails";
import * as React from "react";
import { WishType } from "~/services/wishlist/types";

export function FriendsPageContent({
  friends,
  reservedWishes,
}: {
  friends: FriendUser[];
  reservedWishes: (WishType & { user: OtherUser })[];
}) {
  const { t } = useTranslation();
  const queryParams = useSearchParams();
  const initialTab = queryParams.get("tab");
  const [tab, setTab] = useState(
    initialTab && ["friends", "reserved-wishes"].includes(initialTab) ? initialTab : "friends",
  );

  return (
    <WithStickyFooter footer={null}>
      <Tabs className="flex size-full flex-col" value={tab} onValueChange={setTab}>
        <TabsList className="sticky top-0 z-10 mx-auto flex w-full items-center justify-center gap-2 border-b border-b-muted bg-background px-4 py-5 sm:border-b-0">
          <TabsTrigger value="friends" className="grow text-sm">
            {t("friends.tabs.friends")}
          </TabsTrigger>
          <TabsTrigger value="reserved-wishes" className="grow text-sm">
            {t("friends.tabs.reservedWishes")}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="friends"
          className="mx-auto flex w-full max-w-lg grow flex-col bg-muted p-4 shadow-[0_-10px_0_5px_#fff] sm:rounded"
        >
          <FriendsList friends={friends} />
        </TabsContent>
        <TabsContent
          value="reserved-wishes"
          className="mx-auto flex w-full max-w-lg grow flex-col bg-muted p-4 shadow-[0_-10px_0_5px_#fff] sm:rounded"
        >
          {reservedWishes.length > 0 ? (
            <WishlistItems>
              {reservedWishes.map(wish => (
                <WishDetails
                  key={wish.id}
                  wish={wish}
                  username={wish.user.username}
                  isForeign
                  reservedByCurrentUser
                  isLoggedIn
                  showUsernameInDetails
                />
              ))}
            </WishlistItems>
          ) : (
            <EmptyList shape="3" />
          )}
        </TabsContent>
      </Tabs>
    </WithStickyFooter>
  );
}

function FriendsList({ friends }: { friends: FriendUser[] }) {
  const { t } = useTranslation();

  if (!friends.length) {
    return <EmptyList shape="4" />;
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pb-4">
      {friends.map(friend => {
        return (
          <UserDetails
            key={friend.id}
            user={friend}
            context="friends"
            extraContent={
              friend.recentWishes.length > 0 ? (
                <div className="mt-1 truncate text-xs text-foreground/60">
                  {t("friends.recentWishes", { count: friend.recentWishes.length })}
                </div>
              ) : undefined
            }
            isLink
          />
        );
      })}
    </div>
  );
}
