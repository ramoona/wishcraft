import { prisma } from "../client";
import { createWishlist, WISH_FIELDS_SELECT } from "./wishlist";
import { PrismaError } from "../errors";
import { omit } from "ramda";
import { User, UserWithRelations } from "~/types/user";

export async function updateUsername({ userId, username }: { userId: string; username: string }) {
  const userWithUsername = await prisma.user.findUnique({ where: { username } });

  if (userWithUsername) {
    throw new PrismaError("USERNAME_IS_TAKEN");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { username },
  });
}

export async function finalizeSignUp({ userId, username }: { userId: string; username: string }) {
  await updateUsername({ userId, username });
  await createWishlist(userId);
}

export async function getUserByUserId(id: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, name: true, image: true, email: true },
  });

  if (!user) {
    throw new PrismaError("USER_NOT_FOUND");
  }

  return user;
}

export async function getUserWithRelationsByUsername(username: string): Promise<UserWithRelations> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      wishlists: {
        include: {
          wishes: {
            orderBy: {
              createdAt: "desc",
            },
            where: {
              status: {
                notIn: ["ARCHIVED"],
              },
            },
            select: WISH_FIELDS_SELECT,
          },
        },
      },
    },
  });

  if (!user) {
    throw new PrismaError("USER_NOT_FOUND");
  }

  if (!user.wishlists.length) {
    throw new PrismaError("WISHLIST_NOT_FOUND");
  }

  return {
    ...omit(["wishlists", "username"], user),
    username: user.username!,
    wishlist: user.wishlists[0],
  };
}
