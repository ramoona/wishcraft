"use client";

import { WishlistType, WishType } from "~/services/wishlist/types";
import { WishItemList } from "~/components/wishlist/WishItemList";
import { groupBy } from "ramda";
import { WishStatus } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WishDrawer } from "~/components/wishlist/own/WishDrawer";
import { WishDetails } from "~/components/wishlist/own/WishDetails";
import { OtherUser } from "~/services/user/types";
import { ForeignWishReserved } from "~/components/wishlist/own/ForeignWishReserved";

export function OwnWishlist({
  data,
  reserved,
  showOwnReserved,
}: {
  data: WishlistType;
  reserved: (WishType & { user: OtherUser })[];
  showOwnReserved: boolean;
}) {
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
    <div className="mx-auto flex size-full flex-col gap-6">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mx-auto flex w-full items-center justify-center bg-background px-2 py-5">
          <TabsTrigger value="active" className="max-w-28 grow">
            Active
          </TabsTrigger>
          <TabsTrigger value="fulfilled" className="max-w-28 grow">
            Fulfilled
          </TabsTrigger>
          <TabsTrigger value="archived" className="max-w-28 grow">
            Archived
          </TabsTrigger>
          <TabsTrigger value="reserved" className="max-w-28 grow">
            Reserved
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mx-auto max-w-xl p-4">
          <p className="mb-4 w-full text-center text-xs">
            <b>Anyone</b> can see your Active Wishes
            <br />
            if they are not set to <b>Private</b>
          </p>
          {active.length > 0 ? (
            <WishItemList>
              {active.map(wish => (
                <WishItem key={wish.id} wish={wish} showReserved={showOwnReserved} />
              ))}
            </WishItemList>
          ) : (
            <EmptyWishlistSection />
          )}
        </TabsContent>
        <TabsContent value="fulfilled" className="mx-auto max-w-xl p-4">
          <PrivateSectionNote type="fulfilled" />
          {fulfilled.length > 0 ? (
            <WishItemList>
              {fulfilled.map(wish => (
                <WishItem key={wish.id} wish={wish} />
              ))}
            </WishItemList>
          ) : (
            <EmptyWishlistSection />
          )}
        </TabsContent>
        <TabsContent value="archived" className="mx-auto max-w-xl p-4">
          <div>
            <PrivateSectionNote type="archived" />
            {archived.length > 0 ? (
              <WishItemList>
                {archived.map(wish => (
                  <WishItem key={wish.id} wish={wish} />
                ))}
              </WishItemList>
            ) : (
              <EmptyWishlistSection />
            )}
          </div>
        </TabsContent>
        <TabsContent value="reserved" className="mx-auto max-w-xl p-4">
          <div>
            <p className="mb-4 w-full text-center text-xs">Here you can find all the wishes you have reserved</p>
            {reserved.length > 0 ? (
              <WishItemList>
                {reserved.map(wish => (
                  <ForeignWishReserved key={wish.id} wish={wish} user={wish.user} />
                ))}
              </WishItemList>
            ) : (
              <EmptyWishlistSection />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WishItem({ wish, showReserved }: { wish: WishType; showReserved?: boolean }) {
  return (
    <div key={wish.id} className="flex w-full items-start gap-2">
      <WishDrawer wish={wish} mode="update" showReserved={showReserved}>
        <button type="button" className="w-full">
          <WishDetails {...wish} showReserved={showReserved} />
        </button>
      </WishDrawer>
    </div>
  );
}

function PrivateSectionNote({ type }: { type: string }) {
  return (
    <p className="mb-4 w-full text-center text-xs">
      <b>Only you</b> can see your {type} wishes
    </p>
  );
}

function EmptyWishlistSection() {
  return <div className="mt-16 text-center text-slate-500">There are no wishes here yet...</div>;
}
