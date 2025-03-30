"use client";

import { cn } from "~/utils/classnames";

import { CombinedShape } from "~/components/shapes/CombinedShapes";
import { WishType } from "~/services/wishlist/types";

const backgroundUrls = {
  gray: "/images/gray.svg",
  black: "/images/black.svg",
  yellow: "/images/yellow.svg",
  purple: "/images/purple.svg",
};

const colors = {
  gray: "#D8D6D6",
  black: "#000000",
  yellow: "#FFF5A2",
  purple: "#DDC2FF",
};

export function WishLargeArtwork({
  className,
  shape,
  backgroundPositionX,
  backgroundColor,
  backgroundPositionY,
  mainColor,
  accentColor,
}: Pick<
  WishType,
  "shape" | "mainColor" | "accentColor" | "backgroundColor" | "backgroundPositionX" | "backgroundPositionY"
> & {
  className?: string;
}) {
  const url = backgroundUrls[backgroundColor];
  return (
    <div
      className={cn("relative h-[118px] w-full rounded-t", className)}
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: "400%",
        backgroundPositionX: `${backgroundPositionX}%`,
        backgroundPositionY: `${backgroundPositionY}%`,
        backgroundColor: colors[backgroundColor],
      }}
    >
      <div className="absolute bottom-4 left-4 h-[125px]">
        <CombinedShape shape={shape} accent={accentColor} color={mainColor} />
      </div>
    </div>
  );
}
