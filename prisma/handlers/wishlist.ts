import { Currency, WishStatus } from "@prisma/client";

import { prisma } from "../client";
import { PrismaError } from "../errors";
import { WishlistT } from "~/types/wishlist";

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

export async function getWishlistIdByUserId(userId: string): Promise<string> {
  const wishlist = await prisma.wishlist.findFirst({
    where: { ownerId: userId },
  });

  if (!wishlist) {
    throw new PrismaError("WISHLIST_NOT_FOUND");
  }

  return wishlist.id;
}

export async function getWishlistByUserId(userId: string): Promise<WishlistT> {
  const wishlist = await prisma.wishlist.findFirst({
    where: { ownerId: userId },
    select: {
      wishes: {
        select: WISH_FIELDS_SELECT,
        orderBy: {
          createdAt: "desc",
        },
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
    url?: string | null;
    price?: number | null;
    currency?: Currency | null;
    comment?: string | null;
  },
) {
  return prisma.wish.create({
    data: {
      wishlistId,
      ...input,
      status: WishStatus.ACTIVE,
    },
  });
}

export function updateWish(
  wishId: string,
  input: {
    name?: string;
    url?: string | null;
    price?: number | null;
    currency?: Currency | null;
    comment?: string | null;
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

export async function reserveWish({ wishId, userId }: { wishId: string; userId: string }) {
  const wish = await prisma.wish.findUnique({ where: { id: wishId } });

  if (!wish) {
    throw new PrismaError("WISH_NOT_FOUND");
  }

  if (wish.reservedById) {
    throw new PrismaError("WISH_IS_ALREADY_RESERVED");
  }

  if (wish.status !== WishStatus.ACTIVE) {
    throw new PrismaError("WISH_IS_NOT_RESERVABLE");
  }

  return prisma.wish.update({
    where: { id: wishId },
    data: { reservedById: userId, status: WishStatus.RESERVED },
  });
}
