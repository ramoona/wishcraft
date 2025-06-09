import { WishType } from "~/services/wishlist/types";
import { WishLargeArtwork } from "~/components/shapes/WishLargeArtwork";
import { Price } from "~/components/wishlist/Price";
import { WishStatus } from "~/components/wishlist/WishStatus";
import { TypographyH1 } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { WishDropdownMenu } from "~/components/wishlist/own/WishDropdownMenu";
import React, { useState } from "react";
import { useUpdateWish } from "~/components/wishlist/own/hooks";
import { ReserveButton } from "~/components/wishlist/foreign/ReserveButton";
import { useTranslation } from "react-i18next";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { WishForm } from "~/components/wishlist/own/WishForm";
import { showSuccessToast } from "~/components/ui/toasts";
import { successMessages } from "~/core/errorMessages";

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
  onEnableEditMode?: () => void;
  isLoggedIn?: boolean;
}) {
  const { name, isPrivate, price, currency, reservedById, url, comment, ...visuals } = wish;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-[100vw] px-6 sm:max-w-lg lg:max-w-screen-xl lg:px-0">
      <div className="relative mt-12 flex min-h-[400px] flex-col rounded bg-background lg:mt-6 lg:h-fit lg:min-h-fit">
        <WishLargeArtwork {...visuals} />
        {!isForeign && <WishDropdownMenu wish={wish} onEdit={() => setEditModalOpen(true)} />}
        <div className="flex grow flex-col p-4 lg:rounded-b-lg lg:border lg:border-t-0">
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

          <MobileOnly>
            <div className="mt-10">
              {isForeign ? (
                <div>
                  <ForeignWishActions
                    wish={wish}
                    isLoggedIn={isLoggedIn}
                    reservedByCurrentUser={reservedByCurrentUser}
                    username={username}
                  />
                </div>
              ) : (
                onEnableEditMode && (
                  <MobileOnly>
                    <OwnWishActions wish={wish} enableEditMode={onEnableEditMode} />
                  </MobileOnly>
                )
              )}
            </div>
          </MobileOnly>

          <DesktopOnly>
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <VisuallyHidden>
                    <DialogTitle>Update your wish</DialogTitle>
                  </VisuallyHidden>
                  <VisuallyHidden>
                    <DialogDescription>Here you can update your wish details</DialogDescription>
                  </VisuallyHidden>
                  <DialogContent>
                    <WishForm
                      wish={wish}
                      showReserved={showReserved}
                      onBack={() => setEditModalOpen(false)}
                      onActionSuccess={() => {
                        setEditModalOpen(false);
                        showSuccessToast(t(successMessages.SAVED));
                      }}
                    />
                  </DialogContent>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </DesktopOnly>
        </div>
      </div>
    </div>
  );
}

function OwnWishActions({ wish, enableEditMode }: { wish: WishType; enableEditMode: () => void }) {
  const [isUpdating, updateWish] = useUpdateWish();
  const isEditable = wish.status === "ACTIVE" || wish.status === "RESERVED";
  const { t } = useTranslation();

  return (
    <div className="flex justify-center">
      {isEditable ? (
        <Button size="lg" onClick={enableEditMode}>
          {t("actions.edit")}
        </Button>
      ) : (
        <Button onClick={() => updateWish(wish.id, { status: "ACTIVE" })} size="lg" isLoading={isUpdating}>
          {t("actions.moveWishToActive")}
        </Button>
      )}
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
