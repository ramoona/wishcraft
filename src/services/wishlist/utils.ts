import { WishShape, WishType } from "~/services/wishlist/types";
import { MAX_NUMBER_OF_WISH_SHAPES, WISH_COLORS } from "~/services/wishlist/consts";

export function generateWishVisuals(): Pick<
  WishType,
  "shape" | "mainColor" | "accentColor" | "backgroundColor" | "backgroundPositionX" | "backgroundPositionY"
> {
  const MAX_BG_SHIFT = 80;

  const backgroundPositionX = Math.floor(Math.random() * MAX_BG_SHIFT);
  const backgroundPositionY = Math.floor(Math.random() * MAX_BG_SHIFT);
  const shape = `shape-${Math.floor(Math.random() * MAX_NUMBER_OF_WISH_SHAPES + 1)}` as WishShape;
  const mainColor = WISH_COLORS[Math.floor(Math.random() * WISH_COLORS.length)];

  const accentColorOptions = WISH_COLORS.filter(color => color !== mainColor);
  const accentColor = accentColorOptions[Math.floor(Math.random() * accentColorOptions.length)];

  const backgroundColorOptions = accentColorOptions.filter(color => color !== accentColor);
  const backgroundColor = backgroundColorOptions.filter(color => color !== mainColor && color !== accentColor)[
    Math.floor(Math.random() * backgroundColorOptions.length)
  ];

  return {
    shape,
    mainColor,
    accentColor,
    backgroundColor,
    backgroundPositionX,
    backgroundPositionY,
  };
}
