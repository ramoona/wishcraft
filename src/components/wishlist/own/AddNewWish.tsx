"use client";

import { Button } from "~/components/ui/button";
import * as React from "react";
import { WishOverlay } from "~/components/wishlist/WishOverlay";
import { useState } from "react";

export function AddNewWish() {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div className="mt-auto px-4 pb-4">
      <div className="flex items-center justify-center gap-4">
        <Button size="lg" type="button" onClick={() => setIsSelected(true)}>
          Make a wish
        </Button>
      </div>
      {isSelected && <WishOverlay onBack={() => setIsSelected(false)} />}
    </div>
  );
}
