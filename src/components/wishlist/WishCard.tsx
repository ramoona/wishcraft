import { WishType } from "~/services/wishlist/types";
import { backgroundColors, backgroundUrls, WishLargeArtwork } from "~/components/shapes/WishLargeArtwork";
import { Price } from "~/components/wishlist/Price";
import { WishStatus } from "~/components/wishlist/WishStatus";
import { Button } from "~/components/ui/button";
import { ForeignWishDropdownMenu, OwnWishDropdownMenu } from "~/components/wishlist/own/WishDropdownMenu";
import React, { useState } from "react";
import { useUpdateWish } from "~/components/wishlist/own/hooks";
import { ReserveButton } from "~/components/wishlist/foreign/ReserveButton";
import { Trans, useTranslation } from "react-i18next";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { WishForm } from "~/components/wishlist/own/WishForm";
import { showSuccessToast } from "~/components/ui/toasts";
import { successMessages } from "~/core/error-messages";

export function WishCard({
  reservedByCurrentUser,
  showReserved,
  username,
  isForeign,
  wish,
  onEnableEditMode,
  isLoggedIn,
  withOwnerUsername,
}: {
  wish: WishType;
  reservedByCurrentUser?: boolean;
  showReserved?: boolean;
  username?: string;
  isForeign?: boolean;
  onEnableEditMode?: () => void;
  isLoggedIn?: boolean;
  withOwnerUsername?: boolean;
}) {
  const { name, isPrivate, price, currency, reservedById, url, comment, ...visuals } = wish;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { t } = useTranslation();

  const backgroundUrl = backgroundUrls[visuals.backgroundColor];

  return (
    <div className="group relative w-full max-w-[100vw] px-6 sm:max-w-lg lg:max-w-screen-xl lg:px-0">
      <DesktopOnly>
        <div
          className="absolute h-12 w-full border lg:rounded-xl"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: "200%",
            backgroundPositionX: `${visuals.backgroundPositionX}%`,
            backgroundPositionY: `${visuals.backgroundPositionY}%`,
            backgroundColor: backgroundColors[visuals.backgroundColor],
          }}
        />
      </DesktopOnly>
      <div className="relative mt-12 flex min-h-[400px] flex-col rounded bg-background lg:mt-4 lg:h-fit lg:min-h-fit lg:rounded-xl lg:border">
        <MobileOnly>
          <WishLargeArtwork {...visuals} />
          {!isForeign && <OwnWishDropdownMenu wish={wish} onEdit={() => setEditModalOpen(true)} />}
        </MobileOnly>
        <div className="flex grow flex-col p-4">
          <div className="grow">
            {withOwnerUsername && (
              <Trans
                t={t}
                i18nKey="wishlist.wishOwnerWithLink"
                className="mb-2 text-sm underline"
                values={{ username: wish.owner.username }}
                components={{
                  profile: <a href={`/${wish.owner.username}`} />,
                }}
              />
            )}
            <div className="space-y-1">
              <div className="flex w-full items-baseline justify-between gap-4">
                <div className="grow">
                  {!isForeign ? (
                    <DesktopOnly className="float-left mr-2 h-4">
                      <OwnWishDropdownMenu side="right" wish={wish} onEdit={() => setEditModalOpen(true)} />
                    </DesktopOnly>
                  ) : (
                    (reservedByCurrentUser || !wish.reservedById) && (
                      <DesktopOnly className="float-left mr-1 h-4">
                        <ForeignWishDropdownMenu
                          wish={wish}
                          isLoggedIn={isLoggedIn}
                          reservedByCurrentUser={reservedByCurrentUser}
                        />
                      </DesktopOnly>
                    )
                  )}
                  <h2 className="text-xl font-bold lg:text-lg lg:font-medium">{name}</h2>
                </div>
                <Price price={price} currency={currency} size="large" />
              </div>
              <WishStatus
                isPrivate={isPrivate}
                showReserved={showReserved}
                reservedById={reservedById}
                reservedByCurrentUser={reservedByCurrentUser}
                isForeign={isForeign}
              />
            </div>
            {(url || comment) && (
              <div className="mt-4 space-y-2 lg:text-sm">
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
                    <DialogDescription>Here you can update your wish details</DialogDescription>
                  </VisuallyHidden>
                  <DialogContent>
                    <WishForm
                      username={username || ""}
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
  const isEditable = wish.status === "ACTIVE";
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
