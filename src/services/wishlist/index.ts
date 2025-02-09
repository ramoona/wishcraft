import { WishStatus } from "@prisma/client";

import { prisma } from "prisma/client";
import { WishCreateInput, WishlistType, WishUpdateInput } from "~/services/wishlist/types";
import { WishlistError } from "~/services/wishlist/errors";
import { ServerError } from "~/services/errors";
import { getSessionUserOrThrow } from "~/services/auth";

export const WISH_FIELDS_SELECT = {
  id: true,
  name: true,
  status: true,
  price: true,
  currency: true,
  comment: true,
  url: true,
  reservedById: true,
  isPrivate: true,
};

export async function getWishlistIdByUserId(userId: string): Promise<string> {
  const wishlist = await prisma.wishlist.findFirst({ where: { ownerId: userId } });

  if (!wishlist) {
    throw new WishlistError("WISHLIST_NOT_FOUND");
  }

  return wishlist.id;
}

export async function getWishlistByUserId(userId: string): Promise<WishlistType> {
  const wishlist = await prisma.wishlist.findFirst({
    where: { ownerId: userId },
    select: {
      createdAt: true,
      updatedAt: true,
      wishes: {
        select: WISH_FIELDS_SELECT,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!wishlist) {
    throw new WishlistError("WISHLIST_NOT_FOUND");
  }

  return wishlist;
}

export function createWish(wishlistId: string, input: WishCreateInput) {
  return prisma.wishlist.update({
    where: { id: wishlistId },
    data: {
      updatedAt: new Date(),
      wishes: {
        create: {
          ...input,
          status: WishStatus.ACTIVE,
        },
      },
    },
  });
}

export function updateWish(wishId: string, input: Omit<WishUpdateInput, "id">) {
  // TODO: validate input with schema
  if (!wishId || !input) {
    throw new ServerError("INVALID_INPUT");
  }

  return prisma.wish.update({ where: { id: wishId }, data: input });
}

export function deleteWish(wishId: string) {
  if (!wishId) {
    throw new ServerError("INVALID_INPUT");
  }

  return prisma.wish.delete({ where: { id: wishId } });
}

export async function reserveWish({ wishId, userId }: { wishId: string; userId: string }) {
  if (!wishId) {
    throw new ServerError("INVALID_INPUT");
  }

  const wish = await prisma.wish.findUnique({ where: { id: wishId } });

  if (!wish) {
    throw new WishlistError("WISH_NOT_FOUND");
  }

  if (wish.reservedById) {
    throw new WishlistError("WISH_IS_ALREADY_RESERVED");
  }

  if (wish.status !== WishStatus.ACTIVE) {
    throw new WishlistError("WISH_IS_NOT_RESERVABLE");
  }

  return prisma.wish.update({
    where: { id: wishId },
    data: { reservedById: userId, status: WishStatus.RESERVED },
  });
}

export async function releaseWish({ wishId, userId }: { wishId: string; userId: string }) {
  if (!wishId) {
    throw new ServerError("INVALID_INPUT");
  }

  const wish = await prisma.wish.findUnique({ where: { id: wishId } });

  if (!wish) {
    throw new WishlistError("WISH_NOT_FOUND");
  }

  if (wish.reservedById !== userId) {
    throw new WishlistError("WISH_IS_RESERVED_BY_ANOTHER_USER");
  }

  if (wish.status !== WishStatus.RESERVED) {
    throw new WishlistError("WISH_IS_NOT_RESERVED");
  }

  return prisma.wish.update({
    where: { id: wishId },
    data: { reservedById: null, status: WishStatus.ACTIVE },
  });
}

export async function getForeignWishlistByUsername(username: string): Promise<WishlistType> {
  const wishlist = await prisma.wishlist.findFirst({
    where: { owner: { username } },
    include: {
      wishes: {
        orderBy: {
          createdAt: "desc",
        },
        where: {
          isPrivate: { not: true },
          status: {
            notIn: ["ARCHIVED"],
          },
        },
        select: WISH_FIELDS_SELECT,
      },
    },
  });

  if (!wishlist) {
    throw new WishlistError("WISHLIST_NOT_FOUND");
  }

  return wishlist;
}

export async function getUsersWithWishesReservedByCurrentUser() {
  const sessionUser = await getSessionUserOrThrow();

  return prisma.user.findMany({
    where: { wishlists: { some: { wishes: { some: { reservedById: sessionUser.id } } } } },
    select: {
      wishlists: {
        select: {
          wishes: {
            where: { reservedById: sessionUser.id },
            select: WISH_FIELDS_SELECT,
          },
        },
      },
    },
  });
}
