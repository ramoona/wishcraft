"use client";

import React, { PropsWithChildren, useEffect, useState } from "react";
import useMasonry from "~/hooks/useMasonry";
import { WishType } from "~/services/wishlist/types";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { cn } from "~/utils/classnames";
import { backgroundColors, backgroundUrls } from "~/components/shapes/WishLargeArtwork";

export function WishlistItems({ children, wishes = [] }: PropsWithChildren<{ wishes?: WishType[] }>) {
  return (
    <>
      <DesktopOnly>
        <WishlistItemsDesktop wishes={wishes}>{children}</WishlistItemsDesktop>
      </DesktopOnly>
      <MobileOnly>
        <WishlistItemsMobile>{children}</WishlistItemsMobile>
      </MobileOnly>
    </>
  );
}

export function WishlistItemsDesktop({ children, wishes = [] }: PropsWithChildren<{ wishes?: WishType[] }>) {
  const [mounted, setMounted] = useState(false);
  const { initialized, container } = useMasonry(wishes);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, [mounted]);

  return (
    <>
      <div className="relative">
        <div
          className={cn(
            "absolute grid w-full grid-cols-2 flex-wrap items-start gap-8 pr-8 transition-opacity duration-300 xl:grid-cols-3",
            initialized && mounted && "opacity-0",
          )}
        >
          {wishes?.map(({ id, backgroundColor, backgroundPositionY, backgroundPositionX }) => (
            <div key={id} className={cn("relative h-20 animate-pulse")}>
              <div
                className="absolute h-12 w-full rounded-xl border"
                style={{
                  backgroundImage: `url(${backgroundUrls[backgroundColor]})`,
                  backgroundSize: "200%",
                  backgroundPositionX: `${backgroundPositionX}%`,
                  backgroundPositionY: `${backgroundPositionY}%`,
                  backgroundColor: backgroundColors[backgroundColor],
                }}
              />
              <div className="relative mt-4 flex h-full flex-col rounded-xl border bg-background p-4">
                <div className="h-[28px] w-32 rounded-md bg-stone-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "relative grid grid-cols-2 flex-wrap items-start gap-x-8 gap-y-3 pr-8 opacity-0 xl:grid-cols-3",
          initialized && "opacity-100 transition-opacity duration-300",
        )}
        ref={container}
      >
        {children}
      </div>
    </>
  );
}

export function WishlistItemsMobile({ children }: PropsWithChildren) {
  return <div className="flex flex-col flex-wrap items-start gap-5">{children}</div>;
}
