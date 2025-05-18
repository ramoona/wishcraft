import { WishType } from "~/services/wishlist/types";
import { WishLargeArtwork } from "~/components/shapes/WishLargeArtwork";
import { Price } from "~/components/wishlist/Price";
import { WishStatus } from "~/components/wishlist/WishStatus";
import { TypographyH1 } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { WishDropdownMenu } from "~/components/wishlist/own/WishDropdownMenu";
import React from "react";
import { useUpdateWish } from "~/components/wishlist/own/hooks";
import { ReserveButton } from "~/components/wishlist/foreign/ReserveButton";

export function WishCard({
  reservedByCurrentUser,
  showReserved,
  username,
  isForeign,
  wish,
  onEnableEditMode,
  isLoggedIn,
}: {
  wish: WishType;
  reservedByCurrentUser?: boolean;
  showReserved?: boolean;
  username?: string;
  isForeign?: boolean;
  onEnableEditMode: () => void;
  isLoggedIn?: boolean;
}) {
  const { name, isPrivate, price, currency, reservedById, url, comment, ...visuals } = wish;

  return (
    <div className="w-full max-w-[100vw] px-6 sm:max-w-lg">
      <div className="mt-12 flex min-h-[400px] flex-col rounded bg-background">
        <WishLargeArtwork {...visuals} />
        <div className="flex grow flex-col gap-10 p-4">
          <div className="grow">
            {username && <span className="mb-2 block">{`@${username}'s wish`}</span>}
            <div className="mb-1 flex w-full items-baseline justify-between gap-4">
              <TypographyH1>{name}</TypographyH1>
              <Price price={price} currency={currency} size="large" />
            </div>
            <WishStatus
              isPrivate={isPrivate}
              showReserved={showReserved}
              reservedById={reservedById}
              reservedByCurrentUser={reservedByCurrentUser}
              isForeign={isForeign}
            />
            {(url || comment) && (
              <div className="mt-4 space-y-2">
                {url && (
                  <a href={url} target="_blank" className="block truncate">
                    {url.replace(/^(?:https?:\/\/)?/, "")}
                  </a>
                )}
                {comment && <p>{comment}</p>}
              </div>
            )}
          </div>

          {isForeign ? (
            <ForeignWishActions
              wish={wish}
              isLoggedIn={isLoggedIn}
              reservedByCurrentUser={reservedByCurrentUser}
              username={username}
            />
          ) : (
            <OwnWishActions wish={wish} enableEditMode={onEnableEditMode} />
          )}
        </div>
      </div>
    </div>
  );
}

function OwnWishActions({ wish, enableEditMode }: { wish: WishType; enableEditMode: () => void }) {
  const [isUpdating, updateWish] = useUpdateWish();
  const isEditable = wish.status === "ACTIVE" || wish.status === "RESERVED";

  return (
    <div className="grid grid-cols-[auto_6rem] gap-4">
      {isEditable ? (
        <Button size="lg" fullWidth onClick={enableEditMode} minWidth={false}>
          Edit Wish
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() => updateWish(wish.id, { status: "ACTIVE" })}
          size="lg"
          isLoading={isUpdating}
        >
          Move to Active
        </Button>
      )}
      <WishDropdownMenu onActionSuccess={() => undefined} wish={wish} />
    </div>
  );
}

function ForeignWishActions({
  wish,
  isLoggedIn,
  reservedByCurrentUser,
  username,
}: {
  wish: WishType;
  isLoggedIn?: boolean;
  reservedByCurrentUser?: boolean;
  username?: string;
}) {
  const isWishReservable = reservedByCurrentUser || !wish.reservedById;

  if (!isWishReservable) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <ReserveButton wishId={wish.id} isReserved={!!wish.reservedById} isLoggedIn={isLoggedIn} username={username} />
    </div>
  );
}
