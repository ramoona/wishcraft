import { WishStatus } from "@prisma/client";
import { WISH_COLORS } from "~/services/wishlist/consts";

export type WishlistType = {
  wishes: WishType[];
  createdAt: Date;
  updatedAt: Date;
};

export type WishType = {
  id: string;
  name: string;
  comment: string | null;
  url: string | null;
  price: number | null;
  currency: string | null;
  reservedById: string | null;
  status: WishStatus;
  isPrivate: boolean | null;
  shape: WishShape;
  mainColor: WishColor;
  accentColor: WishColor;
  backgroundColor: WishColor;
  backgroundPositionX: number;
  backgroundPositionY: number;
};

export type WishCreateInput = {
  name: string;
  comment?: string | null;
  url?: string | null;
  price?: number | null;
  currency?: string | null;
  isPrivate?: boolean;
};

export type WishUpdateInput = {
  id: string;
  name?: string;
  comment?: string | null;
  url?: string | null;
  price?: number | null;
  currency?: string | null;
  reservedById?: string | null;
  status?: WishStatus;
};

export type WishShape = `shape-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`;
export type WishColor = (typeof WISH_COLORS)[number];
