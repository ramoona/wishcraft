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
  ...props
}: {
  wish?: WishType;
  reservedByCurrentUser?: boolean;
  showReserved?: boolean;
  username?: string;
  isForeign?: boolean;
  onBack: () => void;
  isLoggedIn?: boolean;
}) {
  const [editMode, setEditMode] = useState(!wish);

  if (editMode || !wish) {
    return (
      <div className="fixed left-0 top-20 z-20 bg-background" style={{ height: "calc(100dvh - 10rem)" }}>
        <WishForm
          {...props}
          wish={wish}
          onActionSuccess={() => {
            setEditMode(false);
            onBack();
          }}
          onBack={() => {
            setEditMode(false);
            onBack();
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-20 z-20 bg-muted" style={{ height: "calc(100dvh - 10rem)" }}>
      <Scrollable
        footer={
          <Button onClick={onBack} variant="outline" size="lg" className="mt-auto">
            Back to Wishes
          </Button>
        }
      >
        <div>
          <WishCard {...props} wish={wish} onEnableEditMode={() => setEditMode(true)} isLoggedIn={isLoggedIn} />
        </div>
      </Scrollable>
    </div>
  );
}
