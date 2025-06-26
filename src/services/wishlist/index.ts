import { WishStatus, Prisma } from "@prisma/client";

import { prisma } from "prisma/db";
import {
  WishColor,
  WishCreateInput,
  WishlistType,
  WishShape,
  WishType,
  WishUpdateInput,
} from "~/services/wishlist/types";
import { WishlistError } from "~/services/wishlist/errors";
import { ServerError } from "~/services/errors";
import { getSessionUserOrThrow } from "~/services/session";
import { logUserAction } from "~/services/user";
import { OtherUser } from "~/services/user/types";
import { MAX_NUMBER_OF_WISH_SHAPES, WISH_COLORS } from "~/services/wishlist/consts";

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
  shape: true,
  mainColor: true,
  accentColor: true,
  backgroundColor: true,
  backgroundPositionX: true,
  backgroundPositionY: true,
};

type PrismaWish = Prisma.WishGetPayload<{
  select: typeof WISH_FIELDS_SELECT;
}>;

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
      owner: { select: { username: true } },
    },
  });

  if (!wishlist) {
    throw new WishlistError("WISHLIST_NOT_FOUND");
  }

  return {
    ...wishlist,
    wishes: wishlist.wishes.map(wish => convertWish(wish, wishlist.owner)),
  };
}

function generateWishVisuals(): Pick<
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

export async function createWish(wishlistId: string, input: WishCreateInput) {
  const visuals = generateWishVisuals();
  const wish = prisma.wishlist.update({
    where: { id: wishlistId },
    data: {
      updatedAt: new Date(),
      wishes: {
        create: {
          ...input,
          status: WishStatus.ACTIVE,
          ...visuals,
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

  const sessionUser = await getSessionUserOrThrow();
  const wishOwner = await prisma.user.findFirst({
    where: {
      wishlists: {
        some: {
          wishes: {
            some: { id: wishId },
          },
        },
      },
    },
  });

  if (!wishOwner) {
    throw new WishlistError("WISH_NOT_FOUND");
  }

  if (wishOwner.id !== sessionUser.id) {
    throw new WishlistError("CAN_NOT_UPDATE_FOREIGN_WISH");
  }

  await prisma.wish.update({
    where: { id: wishId },
    data: {
      ...input,
      reservedById: input.status === "FULFILLED" || input.status === "ARCHIVED" ? null : undefined,
    },
  });
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
  const wishOwner = await prisma.user.findFirst({
    where: {
      wishlists: {
        some: {
          wishes: {
            some: { id: wishId },
          },
        },
      },
    },
  });

  if (!wish) {
    throw new WishlistError("WISH_NOT_FOUND");
  }

  if (wish.reservedById) {
    throw new WishlistError("WISH_IS_ALREADY_RESERVED");
  }

  if (wish.status !== WishStatus.ACTIVE) {
    throw new WishlistError("WISH_IS_NOT_RESERVABLE");
  }

  if (wishOwner?.id === userId) {
    throw new WishlistError("CAN_NOT_RESERVE_OWN_WISH");
  }

  await prisma.wish.update({
    where: { id: wishId },
    data: { reservedById: userId },
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

  if (!wish.reservedById) {
    throw new WishlistError("WISH_IS_NOT_RESERVED");
  }

  if (wish.reservedById !== userId) {
    throw new WishlistError("WISH_IS_RESERVED_BY_ANOTHER_USER");
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
          status: "ACTIVE",
        },
        select: WISH_FIELDS_SELECT,
      },
      owner: { select: { username: true } },
    },
  });

  if (!wishlist) {
    throw new WishlistError("WISHLIST_NOT_FOUND");
  }

  return {
    ...wishlist,
    wishes: wishlist.wishes.map(wish => convertWish(wish, wishlist.owner)),
  };
}

export async function getWishesReservedByCurrentUser(): Promise<(WishType & { user: Pick<OtherUser, "username"> })[]> {
  const sessionUser = await getSessionUserOrThrow();

  const wishes = await prisma.wish.findMany({
    where: { reservedById: sessionUser.id, isPrivate: false, status: "ACTIVE" },
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
      ...convertWish(wishData, wishlist.owner),
      user: {
        ...user,
        isFriend: friends.length > 0,
      },
    };
  });
}

function convertWish(record: PrismaWish, owner: Pick<OtherUser, "username">): WishType {
  return {
    ...record,
    shape: record.shape as WishShape,
    mainColor: record.mainColor as WishColor,
    accentColor: record.accentColor as WishColor,
    backgroundColor: record.backgroundColor as WishColor,
    backgroundPositionX: record.backgroundPositionX!,
    backgroundPositionY: record.backgroundPositionY!,
    owner,
  };
}
