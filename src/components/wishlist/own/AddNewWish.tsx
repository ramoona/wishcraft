"use client";

import { Button } from "~/components/ui/button";
import * as React from "react";

export function AddNewWish({ onOpenNewWishForm }: { onOpenNewWishForm: () => void }) {
  return (
    <div className="mt-auto px-4">
      <div className="flex items-center justify-center gap-4">
        <Button size="lg" type="button" onClick={onOpenNewWishForm}>
          Make a Wish
        </Button>
      </div>
    </div>
  );
}
