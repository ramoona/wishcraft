"use client";

import { WishlistType, WishType } from "~/services/wishlist/types";
import { WishlistItems } from "~/components/wishlist/WishlistItems";
import { groupBy } from "ramda";
import { WishStatus } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WishDetails } from "~/components/wishlist/WishDetails";
import { AddNewWish } from "~/components/wishlist/own/AddNewWish";
import * as React from "react";
import { WithStickyFooter } from "~/components/ui/scrollable";
import { useState } from "react";
import { WishOverlay } from "~/components/wishlist/WishOverlay";
import { useSearchParams } from "next/navigation";
import { EmptyList } from "~/components/ui/emptyList";
import { Trans, useTranslation } from "react-i18next";

export function OwnWishlist({ data, showOwnReserved }: { data: WishlistType; showOwnReserved: boolean }) {
  const [newWishFormVisible, setNewWishFormVisible] = useState(false);
  const queryParams = useSearchParams();
  const { t } = useTranslation();
  const initialTab = queryParams.get("tab");
  const [tab, setTab] = useState(
    initialTab && ["active", "fulfilled", "archived", "reserved"].includes(initialTab) ? initialTab : "active",
  );
  const {
    active = [],
    fulfilled = [],
    archived = [],
  } = groupBy<WishType>(wish => {
    if (wish.status === "ARCHIVED") {
      return "archived";
    }

    if (wish.status === WishStatus.FULFILLED) {
      return "fulfilled";
    }

    return "active";
  })(data.wishes);

  return (
    <WithStickyFooter footer={<AddNewWish onOpenNewWishForm={() => setNewWishFormVisible(true)} />}>
      {!newWishFormVisible && (
        <Tabs className="flex size-full flex-col" value={tab} onValueChange={setTab}>
          <TabsList className="sticky top-0 z-10 mx-auto flex w-full items-center justify-center border-b border-b-muted bg-background px-4 py-5 sm:border-b-0">
            <TabsTrigger value="active" className="grow text-sm">
              {t("wishlist.tabs.active")}
            </TabsTrigger>
            <TabsTrigger value="fulfilled" className="grow text-sm">
              {t("wishlist.tabs.fulfilled")}
            </TabsTrigger>
            <TabsTrigger value="archived" className="grow text-sm">
              {t("wishlist.tabs.archived")}
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="active"
            className="mx-auto flex w-full max-w-lg grow flex-col bg-muted p-4 shadow-[0_-10px_0_5px_#fff] sm:rounded"
          >
            <TabHint type="active" />
            {active.length > 0 ? (
              <WishlistItems>
                {active.map(wish => (
                  <WishDetails key={wish.id} wish={wish} showReserved={showOwnReserved} isLoggedIn />
                ))}
              </WishlistItems>
            ) : (
              <EmptyWishlistSection shape="1" />
            )}
          </TabsContent>
          <TabsContent
            value="fulfilled"
            className="mx-auto flex w-full max-w-lg grow flex-col bg-muted p-4 shadow-[0_-10px_0_5px_#fff] sm:rounded"
          >
            <TabHint type="fulfilled" />
            {fulfilled.length > 0 ? (
              <WishlistItems>
                {fulfilled.map(wish => (
                  <WishDetails key={wish.id} wish={wish} isLoggedIn />
                ))}
              </WishlistItems>
            ) : (
              <EmptyWishlistSection shape="2" />
            )}
          </TabsContent>
          <TabsContent
            value="archived"
            className="mx-auto flex w-full max-w-lg grow flex-col bg-muted p-4 shadow-[0_-10px_0_5px_#fff] sm:rounded"
          >
            <TabHint type="archived" />
            {archived.length > 0 ? (
              <WishlistItems>
                {archived.map(wish => (
                  <WishDetails key={wish.id} wish={wish} isLoggedIn />
                ))}
              </WishlistItems>
            ) : (
              <EmptyWishlistSection shape="3" />
            )}
          </TabsContent>
        </Tabs>
      )}
      {newWishFormVisible && (
        <WishOverlay
          isLoggedIn
          onBack={() => {
            setNewWishFormVisible(false);
            setTab("active");
          }}
        />
      )}
    </WithStickyFooter>
  );
}

function TabHint({ type }: { type: "active" | "fulfilled" | "archived" }) {
  const { t } = useTranslation();
  const i18nKey = tabHintTranslations[type];

  return (
    <p className="mb-4 w-full text-center text-xs">
      <Trans t={t} i18nKey={i18nKey} components={{ b: <span className="font-bold" /> }} />
    </p>
  );
}

function EmptyWishlistSection({ shape }: { shape: "1" | "2" | "3" | "4" }) {
  return <EmptyList shape={shape} />;
}

const tabHintTranslations = {
  active: "wishlist.tabHints.active",
  fulfilled: "wishlist.tabHints.fulfilled",
  archived: "wishlist.tabHints.archived",
};
