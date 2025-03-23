import { Button } from "~/components/ui/button";
import { WishType } from "~/services/wishlist/types";
import { useState } from "react";
import { WishForm } from "~/components/wishlist/own/WishForm";
import { WishCard } from "~/components/wishlist/WishCard";
import { cn } from "~/utils/classnames";
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
      <div className={cn("absolute left-0 top-0 z-20 flex size-full flex-col items-center bg-background")}>
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
    <div className={cn("absolute left-0 top-0 z-20 flex size-full flex-col items-center bg-muted")}>
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
