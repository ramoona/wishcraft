"use client";

import { Button } from "~/components/ui/button";
import * as React from "react";
import { WishDrawer } from "~/components/wishlist/own/WishDrawer";

export function AddNewWish() {
  return (
    <div className="absolute -top-4 left-0 w-full -translate-y-full px-4">
      <div className="flex items-center justify-center gap-4">
        <WishDrawer mode="create">
          <Button size="lg" type="button">
            Make a wish
          </Button>
        </WishDrawer>
      </div>
    </div>
  );
}
