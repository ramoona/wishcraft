"use client";

import { FriendUser, User } from "~/services/user/types";
import { UserDetails } from "~/components/ui/user";
import { EmptyList } from "~/components/ui/emptyList";
import { WithStickyFooter } from "~/components/ui/scrollable";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { TabButton } from "~/components/ui/tab-button";
import { cn } from "~/utils/classnames";
import useMasonry from "~/hooks/useMasonry";

type Props = {
  friends: FriendUser[];
  user: User;
};

export function FriendsList(props: Props) {
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

function FriendsListMobile({ friends, user }: Props) {
  const { t } = useTranslation();
  return (
    <WithStickyFooter footer={null}>
      <div className="flex size-full flex-col">
        <div className="sticky top-0 z-10 mx-auto flex w-full items-center justify-center border-b border-b-muted bg-background px-4 py-5 sm:border-b-0">
          <TabButton isActive route={`/${user.username}/friends/your-friends`}>
            {t("friends.tabs.friends")}
          </TabButton>
          <TabButton route={`/${user.username}/friends/reserved-wishes`}>{t("friends.tabs.reservedWishes")}</TabButton>
        </div>
        <div className="mx-auto flex w-full max-w-lg grow flex-col bg-muted p-4 shadow-[0_-10px_0_5px_#fff] sm:rounded">
          <p className="mb-4 w-full text-center text-xs lg:mt-2 lg:text-left">{t("friends.subtitle")}</p>
          {friends.length > 0 ? (
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
          ) : (
            <EmptyList shape="4" />
          )}
        </div>
      </div>
    </WithStickyFooter>
  );
}

function FriendsListDesktop({ friends }: Props) {
  const { t } = useTranslation();
  const { initialized, container } = useMasonry(friends);

  return (
    <>
      <div className="mb-8 mt-10">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{t("friends.tabs.friends")}</h1>
        <p className="mb-4 w-full text-center text-xs lg:mt-2 lg:text-left">{t("friends.subtitle")}</p>
      </div>
      {friends.length > 0 ? (
        <>
          <div className="relative">
            <div
              className={cn(
                "absolute grid w-full grid-cols-2 flex-wrap items-start gap-4 pr-8 transition-opacity duration-300 xl:grid-cols-3",
                initialized && "opacity-0",
              )}
            >
              {friends?.map(({ id }) => (
                <div
                  key={id}
                  className="relative flex h-20 animate-pulse flex-col gap-4 rounded-xl border bg-background p-4"
                >
                  <div className={cn("flex max-w-lg items-start gap-4")}>
                    <div className="size-12 rounded-full bg-stone-100" />
                    <div className="flex grow flex-col">
                      <span className="mt-1 h-5 w-28 rounded bg-stone-200" />
                      <span className="mt-0.5 h-5 w-36 rounded bg-stone-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className={cn(
              "relative grid grid-cols-2 flex-wrap items-start gap-4 pr-8 opacity-0 xl:grid-cols-3",
              initialized && "opacity-100 transition-opacity duration-300",
            )}
            ref={container}
          >
            {friends.map(friend => {
              return (
                <UserDetails
                  key={friend.id}
                  user={friend}
                  context="friends"
                  extraContent={
                    friend.recentWishes.length > 0 ? (
                      <div className="mt-1 text-xs text-foreground/60">
                        {t("friends.recentWishes")}
                        <span className="italic">
                          {friend.recentWishes
                            .slice(0, 10)
                            .map(({ name }) => name)
                            .join(", ")}
                        </span>
                      </div>
                    ) : undefined
                  }
                  isLink
                />
              );
            })}
          </div>
        </>
      ) : (
        <EmptyList shape="4" />
      )}
    </>
  );
}
