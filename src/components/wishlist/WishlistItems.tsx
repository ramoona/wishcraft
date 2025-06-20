"use client";

import React, { PropsWithChildren } from "react";
import useMasonry from "~/hooks/useMasonry";
import { WishType } from "~/services/wishlist/types";
import { cn } from "~/utils/classnames";
import { backgroundColors, backgroundUrls } from "~/components/shapes/WishLargeArtwork";

export function WishlistItemsDesktop({ children, wishes = [] }: PropsWithChildren<{ wishes?: WishType[] }>) {
  const { initialized, container } = useMasonry(wishes);

  return (
    <>
      <div className="relative">
        <div
          className={cn(
            "absolute grid w-full grid-cols-2 flex-wrap items-start gap-x-4 gap-y-8 pr-8 transition-opacity duration-300 xl:grid-cols-3",
            initialized && "opacity-0",
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
          "relative grid grid-cols-2 flex-wrap items-start gap-4 pr-8 opacity-0 xl:grid-cols-3",
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
