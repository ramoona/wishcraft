"use client";

import { WishlistType, WishType } from "~/services/wishlist/types";
import { WishItemList } from "~/components/wishlist/WishItemList";
import { groupBy } from "ramda";
import { WishStatus } from "@prisma/client";
import { ShootingStar, Archive, Gift } from "@phosphor-icons/react";
import { AddNewWish, AddNewWishMobile } from "~/components/wishlist/own/AddNewWish";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WishDrawer } from "~/components/wishlist/own/WishDrawer";
import { StatusBadge } from "~/components/wishlist/StatusBadge";
import { WishDropdownMenu } from "~/components/wishlist/own/WishDropdownMenu";
import { WishDetailsDesktop, WishDetailsMobile } from "~/components/wishlist/own/WishDetails";

export function OwnWishlist({ data }: { data: WishlistType }) {
  const isMobile = true;
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
    <>
      <div className="flex min-h-[calc(100vh_-_4rem)] flex-col gap-6 pt-8">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="active" className="flex grow items-center gap-2">
              <ShootingStar />
              Active
            </TabsTrigger>
            <TabsTrigger value="fulfilled" className="flex grow items-center gap-2">
              <Gift />
              Fulfilled
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex grow items-center gap-2">
              <Archive />
              Archived
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <div className="mb-4 flex w-full items-center justify-center gap-1 text-xs text-slate-500">
              <b>Anyone</b> can see your active wishes
            </div>
            <WishItemList>
              {active.map(wish => (
                <WishItem key={wish.id} wish={wish} isMobile={isMobile} />
              ))}
            </WishItemList>
          </TabsContent>
          <TabsContent value="fulfilled">
            <PrivateSectionNote type="fulfilled" />
            {fulfilled.length > 0 ? (
              <div>
                <WishItemList>
                  {fulfilled.map(wish => (
                    <WishItem key={wish.id} wish={wish} isMobile={isMobile} />
                  ))}
                </WishItemList>
              </div>
            ) : (
              <EmptyWishlistSection />
            )}
          </TabsContent>
          <TabsContent value="archived">
            <div>
              <PrivateSectionNote type="archived" />
              {archived.length > 0 ? (
                <WishItemList>
                  {archived.map(wish => (
                    <WishItem key={wish.id} wish={wish} isMobile={isMobile} />
                  ))}
                </WishItemList>
              ) : (
                <EmptyWishlistSection />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {isMobile ? <AddNewWishMobile /> : <AddNewWish />}
    </>
  );
}

function WishItem({ wish, isMobile }: { wish: WishType; isMobile: boolean }) {
  if (isMobile) {
    return (
      <div key={wish.id} className="flex w-full items-start gap-2">
        <WishDrawer wish={wish} mode="update">
          <button type="button" className="w-full">
            <WishDetailsMobile {...wish} />
          </button>
        </WishDrawer>
      </div>
    );
  }

  return (
    <div key={wish.id} className="flex w-full items-start gap-2">
      <WishDetailsDesktop data={wish} />
      <StatusBadge status={wish.status} />
      <WishDropdownMenu wish={wish} />
    </div>
  );
}

function PrivateSectionNote({ type }: { type: string }) {
  return (
    <div className="mb-4 flex w-full items-center justify-center gap-1 text-xs text-slate-500">
      <b>Only you</b> can see your {type} wishes
    </div>
  );
}

function EmptyWishlistSection() {
  return <div className="mt-16 text-center text-slate-500">There are no wishes here yet...</div>;
}
