import { WishStatus } from "@prisma/client";

export type Wishlist = {
  wishes: Wish[];
};

export type Wish = {
  id: string;
  name: string;
  comment: string | null;
  url: string | null;
  price: number | null;
  currency: string | null;
  reservedById: string | null;
  status: WishStatus;
};
