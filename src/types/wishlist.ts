import { WishStatus } from "@prisma/client";

export type WishlistT = {
  wishes: WishT[];
};

export type WishT = {
  id: string;
  name: string;
  comment: string | null;
  url: string | null;
  price: number | null;
  currency: string | null;
  reservedById: string | null;
  status: WishStatus;
};
