import { Button } from "~/components/ui/button";
import { WishType } from "~/services/wishlist/types";
import { useState } from "react";
import { WishForm } from "~/components/wishlist/own/WishForm";
import { WishCard } from "~/components/wishlist/WishCard";
import { cn } from "~/utils/classnames";

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

  return (
    <div
      className={cn(
        "absolute left-0 top-0 z-10 flex size-full flex-col items-center",
        editMode ? "bg-white" : "bg-muted",
      )}
    >
      <div className="flex min-h-full flex-col items-center gap-4 p-4">
        {editMode || !wish ? (
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
        ) : (
          <WishCard {...props} wish={wish} onEnableEditMode={() => setEditMode(true)} isLoggedIn={isLoggedIn} />
        )}
        {!editMode && (
          <Button onClick={onBack} variant="tertiary" size="lg" className="mt-auto">
            Back to Wishes
          </Button>
        )}
      </div>
    </div>
  );
}
