import { Currency, WishStatus } from "@prisma/client";

import { prisma } from "../client";
import { PrismaError } from "../errors";

export const WISH_FIELDS_SELECT = {
  id: true,
  name: true,
  status: true,
  price: true,
  currency: true,
  comment: true,
  url: true,
  reservedById: true,
};

export async function getWishlistByUserId(userId: string) {
  const wishlist = await prisma.wishlist.findFirst({
    where: { ownerId: userId },
    select: {
      wishes: {
        select: WISH_FIELDS_SELECT,
      },
    },
  });

  if (!wishlist) {
    throw new PrismaError("WISHLIST_NOT_FOUND");
  }

  return wishlist;
}

export function createWishlist(userId: string) {
  return prisma.wishlist.create({
    data: { ownerId: userId },
  });
}

export function createWish(
  wishlistId: string,
  input: {
    name: string;
    url?: string;
    price?: number;
    currency?: Currency;
    comment?: string;
  },
) {
  return prisma.wish.create({
    data: {
      wishlistId,
      ...input,
      status: WishStatus.AVAILABLE,
    },
  });
}

export function updateWish(
  wishId: string,
  input: {
    name?: string;
    url?: string;
    price?: number;
    currency?: Currency;
    comment?: string;
    status?: WishStatus;
  },
) {
  return prisma.wish.update({ where: { id: wishId }, data: input });
}

export function deleteWish(wishId: string) {
  return prisma.wish.delete({
    where: { id: wishId },
  });
}
