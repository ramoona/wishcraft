"use client";

import { WishForm } from "~/components/wishlist/own/WishForm";
import { Slider } from "~/components/ui/slider";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import * as React from "react";
import { ShareFat, ShootingStar } from "@phosphor-icons/react";
import { WishDrawer } from "~/components/wishlist/own/WishDrawer";
// import { ShareDrawer } from "~/components/wishlist/own/ShareDrawer";

export function AddNewWish() {
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  return (
    <div className="fixed bottom-4">
      <div className="flex gap-4">
        <Button size="lg">
          <div className="flex items-center justify-center gap-2">
            <ShareFat size={24} />
            Share
          </div>
        </Button>
        <Button onClick={() => setIsSliderOpen(true)} size="lg">
          <div className="flex items-center justify-center gap-2">
            <ShootingStar size={24} />
            Make a wish
          </div>
        </Button>
      </div>
      <Slider isOpen={isSliderOpen} header="Making a wish...">
        <WishForm onCancel={() => setIsSliderOpen(false)} />
      </Slider>
    </div>
  );
}

export function AddNewWishMobile() {
  return (
    <div className="absolute -top-4 left-0 w-full -translate-y-full px-4">
      <div className="flex items-center justify-center gap-4">
        {/*<ShareDrawer />*/}
        <WishDrawer mode="create">
          <Button size="lg" type="button" variant="outline">
            <div className="flex items-center justify-center gap-2">
              <ShootingStar size={24} />
              Make a wish
            </div>
          </Button>
        </WishDrawer>
      </div>
    </div>
  );
}
