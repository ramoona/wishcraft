import { Currency, WishStatus } from "@prisma/client";

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
  currency: Currency | null;
  reservedById: string | null;
  status: WishStatus;
};

export type WishCreateInput = {
  name: string;
  comment?: string | null;
  url?: string | null;
  price?: number | null;
  currency?: Currency | null;
};

export type WishUpdateInput = {
  id: string;
  name?: string;
  comment?: string | null;
  url?: string | null;
  price?: number | null;
  currency?: Currency | null;
  reservedById?: string | null;
  status?: WishStatus;
};
