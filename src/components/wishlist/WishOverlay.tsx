import { Button } from "~/components/ui/button";
import { WishType } from "~/services/wishlist/types";
import { useState } from "react";
import { WishForm } from "~/components/wishlist/own/WishForm";
import { WishCard } from "~/components/wishlist/WishCard";
import { Scrollable } from "~/components/ui/scrollable";

export function WishOverlay({
  onBack,
  isLoggedIn,
  wish,
  firstWish,
  ...props
}: {
  wish?: WishType;
  reservedByCurrentUser?: boolean;
  showReserved?: boolean;
  username?: string;
  isForeign?: boolean;
  onBack: () => void;
  isLoggedIn?: boolean;
  firstWish?: boolean;
}) {
  const [creationMode, setCreationMode] = useState(!wish);

  if (creationMode || !wish) {
    return (
      <div
        className="fixed left-1/2 top-0 z-20 w-screen max-w-lg -translate-x-1/2 bg-background pt-10"
        style={{ height: firstWish ? "100dvh" : "calc(100dvh - 5rem)" }}
      >
        <WishForm
          {...props}
          wish={wish}
          onActionSuccess={() => {
            setCreationMode(false);
            if (!wish) {
              onBack();
            }
          }}
          onBack={() => {
            setCreationMode(false);
            if (!wish) {
              onBack();
            }
          }}
          firstWish={firstWish}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed left-1/2 top-0 z-20 w-screen max-w-lg -translate-x-1/2 bg-muted sm:w-full sm:rounded-b"
      style={{ height: isLoggedIn ? "calc(100dvh - 5rem)" : "100dvh" }}
    >
      <Scrollable
        footer={
          <Button onClick={onBack} variant="outline" size="lg" className="mt-auto">
            Back
          </Button>
        }
      >
        <WishCard {...props} wish={wish} onEnableEditMode={() => setCreationMode(true)} isLoggedIn={isLoggedIn} />
      </Scrollable>
    </div>
  );
}
