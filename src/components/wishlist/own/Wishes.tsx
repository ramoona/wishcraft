"use client";

import { WishType } from "~/services/wishlist/types";
import { WishlistItems } from "~/components/wishlist/WishlistItems";
import { WishDetails } from "~/components/wishlist/WishDetails";
import * as React from "react";
import { EmptyList } from "~/components/ui/emptyList";
import { Trans, useTranslation } from "react-i18next";
import { WishCard } from "~/components/wishlist/WishCard";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { AddNewWish } from "~/components/wishlist/own/AddNewWish";
import { WishOverlay } from "~/components/wishlist/WishOverlay";
import { PropsWithChildren, useState } from "react";
import { WithStickyFooter } from "~/components/ui/scrollable";
import { useParams } from "next/navigation";
import Link from "next/link";

type Props = {
  wishes: WishType[];
  showOwnReserved: boolean;
  status: "ACTIVE" | "FULFILLED" | "ARCHIVED";
};

export function Wishes(props: Props) {
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

function WishesMobile({ wishes, showOwnReserved, status }: Props) {
  const [newWishFormVisible, setNewWishFormVisible] = useState(false);
  const { t } = useTranslation();
  const { username } = useParams<{ username: string }>();

  return (
    <WithStickyFooter footer={<AddNewWish onOpenNewWishForm={() => setNewWishFormVisible(true)} />}>
      {!newWishFormVisible && (
        <div className="flex size-full flex-col">
          <div className="sticky top-0 z-10 mx-auto flex w-full items-center justify-center border-b border-b-muted bg-background px-4 py-5 sm:border-b-0">
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
              <WishlistItems>
                {wishes.map(wish => (
                  <WishDetails key={wish.id} wish={wish} showReserved={showOwnReserved} isLoggedIn />
                ))}
              </WishlistItems>
            ) : (
              <EmptyWishlistSection shape="2" />
            )}
          </div>
        </div>
      )}
      {newWishFormVisible && (
        <WishOverlay
          isLoggedIn
          onBack={() => {
            setNewWishFormVisible(false);
          }}
        />
      )}
    </WithStickyFooter>
  );
}

function WishesDesktop({ wishes, showOwnReserved, status }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <div className="mb-8 mt-10">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{t(STATUS_TO_HEADING[status])}</h1>
        <TabHint status={status} />
      </div>
      {wishes.length > 0 ? (
        <WishlistItems wishes={wishes}>
          {wishes.map(wish => (
            <WishCard key={wish.id} wish={wish} showReserved={showOwnReserved} isLoggedIn />
          ))}
        </WishlistItems>
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

function TabButton({ isActive, route, children }: PropsWithChildren<{ isActive?: boolean; route: string }>) {
  return (
    <Link
      href={route}
      data-state={isActive ? "active" : "inactive"}
      className={
        "inline-flex h-8 grow items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium no-underline ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground lg:w-full lg:justify-start lg:px-4 lg:text-left"
      }
    >
      {children}
    </Link>
  );
}
