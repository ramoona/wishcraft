import { WishStatus } from "@prisma/client";

import { prisma } from "prisma/db";
import { WishCreateInput, WishlistType, WishType, WishUpdateInput } from "~/services/wishlist/types";
import { WishlistError } from "~/services/wishlist/errors";
import { ServerError } from "~/services/errors";
import { getSessionUserOrThrow } from "~/services/session";
import { logUserAction } from "~/services/user";
import { OtherUser } from "~/services/user/types";

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

export async function createWish(wishlistId: string, input: WishCreateInput) {
  const wish = prisma.wishlist.update({
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

  await logUserAction({ action: "wish-created", wish: input });
  return wish;
}

export async function updateWish(wishId: string, input: Omit<WishUpdateInput, "id">) {
  // TODO: validate input with schema
  if (!wishId || !input) {
    throw new ServerError("INVALID_INPUT");
  }

  await prisma.wish.update({ where: { id: wishId }, data: input });
  await logUserAction({ action: "wish-updated", changes: input });
}

export async function deleteWish(wishId: string) {
  if (!wishId) {
    throw new ServerError("INVALID_INPUT");
  }

  await prisma.wish.delete({ where: { id: wishId } });
  await logUserAction({ action: "wish-deleted", wishId });
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

  await prisma.wish.update({
    where: { id: wishId },
    data: { reservedById: userId, status: WishStatus.RESERVED },
  });
  await logUserAction({ action: "wish-reserved", wishId, reservedById: userId });
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

  await prisma.wish.update({
    where: { id: wishId },
    data: { reservedById: null, status: WishStatus.ACTIVE },
  });

  await logUserAction({ action: "wish-released", wishId, reservedById: userId });
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
            notIn: ["ARCHIVED", "FULFILLED"],
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

export async function getWishesReservedByCurrentUser(): Promise<(WishType & { user: OtherUser })[]> {
  const sessionUser = await getSessionUserOrThrow();

  const wishes = await prisma.wish.findMany({
    where: { reservedById: sessionUser.id },
    select: {
      ...WISH_FIELDS_SELECT,
      wishlist: {
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              dayOfBirth: true,
              monthOfBirth: true,
              image: true,
              friends: {
                where: {
                  OR: [{ friendAId: sessionUser.id }, { friendBId: sessionUser.id }],
                },
              },
            },
          },
        },
      },
    },
  });

  return wishes.map(wish => {
    const { wishlist, ...wishData } = wish;
    const { friends, ...user } = wishlist.owner;

    return {
      ...wishData,
      user: {
        ...user,
        isFriend: friends.length > 0,
      },
    };
  });
}
