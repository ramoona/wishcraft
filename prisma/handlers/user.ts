import { prisma } from "../client";
import { createWishlist, WISH_FIELDS_SELECT } from "./wishlist";
import { PrismaError } from "../errors";

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

export async function onboardUser({ userId, username }: { userId: string; username: string }) {
  await updateUsername({ userId, username });
  await createWishlist(userId);
}

export type UserData = Awaited<ReturnType<typeof getUserByUserId>>;
export async function getUserByUserId(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, name: true, image: true, email: true },
  });

  if (!user) {
    throw new PrismaError("USER_NOT_FOUND");
  }

  return user;
}

export type UserWithRelations = Awaited<ReturnType<typeof getUserWithRelationsByUsername>>;
export async function getUserWithRelationsByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      email: true,
      wishlists: {
        include: {
          wishes: {
            select: WISH_FIELDS_SELECT,
          },
        },
      },
    },
  });

  if (!user) {
    throw new PrismaError("USER_NOT_FOUND");
  }

  return user;
}
