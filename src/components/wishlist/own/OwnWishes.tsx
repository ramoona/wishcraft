"use client";

import { WishType } from "~/services/wishlist/types";
import { WishlistItemsDesktop, WishlistItemsMobile } from "~/components/wishlist/WishlistItems";
import { WishDetails } from "~/components/wishlist/WishDetails";
import * as React from "react";
import { EmptyList } from "~/components/ui/empty-list";
import { Trans, useTranslation } from "react-i18next";
import { WishCard } from "~/components/wishlist/WishCard";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { AddNewWish } from "~/components/wishlist/own/AddNewWish";
import { useState } from "react";
import { WithStickyFooter } from "~/components/ui/scrollable";
import { useParams } from "next/navigation";
import { TabButton } from "~/components/ui/tab-button";
import { WishModal } from "~/components/wishlist/WishModal";
import { User } from "~/services/user/types";

type Props = {
  wishes: WishType[];
  showOwnReserved: boolean;
  status: "ACTIVE" | "FULFILLED" | "ARCHIVED";
  currentUser: User;
};

export function OwnWishes(props: Props) {
  return (
    <>
      <DesktopOnly>
        <WishesDesktop {...props} />
      </DesktopOnly>
      <MobileOnly className="flex-col" display="flex">
        <WishesMobile {...props} />
      </MobileOnly>
    </>
  );
}

function WishesMobile({ wishes, showOwnReserved, status, currentUser }: Props) {
  const [newWishFormVisible, setNewWishFormVisible] = useState(false);
  const { t } = useTranslation();
  const { username } = useParams<{ username: string }>();

  return (
    <WithStickyFooter footer={<AddNewWish onOpenNewWishForm={() => setNewWishFormVisible(true)} />}>
      <div className="flex size-full flex-col">
        <div className="sticky -top-px z-10 mx-auto flex w-full items-center justify-center border-b border-b-muted bg-background px-4 py-5 sm:border-b-0">
          <TabButton isActive={status === "ACTIVE"} route={`/${username}/wishes/active`}>
            {t("wishlist.tabs.active")}
          </TabButton>
          <TabButton isActive={status === "FULFILLED"} route={`/${username}/wishes/fulfilled`}>
            {t("wishlist.tabs.fulfilled")}
          </TabButton>
          <TabButton isActive={status === "ARCHIVED"} route={`/${username}/wishes/archived`}>
            {t("wishlist.tabs.archived")}
          </TabButton>
        </div>
        <div className="mx-auto flex w-full max-w-lg grow flex-col bg-muted p-4 shadow-[0_-10px_0_5px_#fff] sm:rounded">
          <TabHint status={status} />
          {wishes.length > 0 ? (
            <WishlistItemsMobile>
              {wishes.map(wish => (
                <WishDetails key={wish.id} username={username} wish={wish} showReserved={showOwnReserved} isLoggedIn />
              ))}
            </WishlistItemsMobile>
          ) : (
            <EmptyWishlistSection shape={STATUS_TO_SHAPE[status]} />
          )}
        </div>
      </div>
      <WishModal
        username={currentUser.username}
        isOpen={newWishFormVisible}
        isLoggedIn
        onOpenChange={setNewWishFormVisible}
      />
    </WithStickyFooter>
  );
}

function WishesDesktop({ wishes, showOwnReserved, status, currentUser }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <div className="my-8">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{t(STATUS_TO_HEADING[status])}</h1>
        <TabHint status={status} />
      </div>
      {wishes.length > 0 ? (
        <WishlistItemsDesktop wishes={wishes}>
          {wishes.map(wish => (
            <WishCard
              username={currentUser.username}
              key={wish.id}
              wish={wish}
              showReserved={showOwnReserved}
              isLoggedIn
            />
          ))}
        </WishlistItemsDesktop>
      ) : (
        <EmptyWishlistSection shape={STATUS_TO_SHAPE[status]} />
      )}
    </>
  );
}

const STATUS_TO_HEADING = {
  ACTIVE: "wishlist.headers.active",
  FULFILLED: "wishlist.headers.fulfilled",
  ARCHIVED: "wishlist.headers.archived",
};

const STATUS_TO_SHAPE = {
  ACTIVE: "1",
  FULFILLED: "2",
  ARCHIVED: "3",
} as const;

function TabHint({ status }: { status: "ACTIVE" | "FULFILLED" | "ARCHIVED" }) {
  const { t } = useTranslation();
  const i18nKey = STATUS_TO_HINT[status];

  return (
    <p className="mb-4 w-full text-center text-xs lg:mt-2 lg:text-left">
      <Trans t={t} i18nKey={i18nKey} components={{ b: <span className="font-bold" /> }} />
    </p>
  );
}

function EmptyWishlistSection({ shape }: { shape: "1" | "2" | "3" | "4" }) {
  return <EmptyList shape={shape} />;
}

const STATUS_TO_HINT = {
  ACTIVE: "wishlist.tabHints.active",
  FULFILLED: "wishlist.tabHints.fulfilled",
  ARCHIVED: "wishlist.tabHints.archived",
};
