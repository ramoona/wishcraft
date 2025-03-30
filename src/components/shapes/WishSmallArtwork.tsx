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

export function WishSmallArtwork({
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
      className={cn("flex size-20 shrink-0 items-center justify-center overflow-hidden", className)}
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: "400%",
        backgroundPositionX: `${backgroundPositionX}%`,
        backgroundPositionY: `${backgroundPositionY}%`,
        backgroundColor: colors[backgroundColor],
      }}
    >
      <CombinedShape shape={shape} accent={accentColor} color={mainColor} width="sm" />
    </div>
  );
}
