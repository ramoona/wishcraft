import { WishStatus } from "@prisma/client";

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
