import { prisma } from "prisma/client";
import { createWishlist, WISH_FIELDS_SELECT } from "../wishlist";
import { omit } from "ramda";
import { UserWithRelations } from "~/services/user/types";
import { generateUniqueUsername } from "~/utils";
import { UserError } from "~/services/user/errors";
import { WishlistError } from "~/services/wishlist/errors";

export async function updateUsername({ userId, username }: { userId: string; username: string }) {
  const isUsernameExists = await isUserNameTaken(username);

  if (isUsernameExists) {
    throw new UserError("USERNAME_IS_TAKEN");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { username },
  });
}

export async function finalizeSignUp({ userId, username }: { userId: string; username: string }) {
  if (!username) {
    throw new UserError("USERNAME_IS_REQUIRED");
  }

  await updateUsername({ userId, username });
  await createWishlist(userId);
}

function isUserNameTaken(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

async function getAvailableUsername(username: string, attempt = 0): Promise<string> {
  if (attempt > 10) {
    throw new UserError("TOO_MANY_ATTEMPTS_TO_GENERATE_USERNAME");
  }

  const isTaken = await isUserNameTaken(username);
  return isTaken ? getAvailableUsername(generateUniqueUsername(), attempt + 1) : username;
}

export async function createUser(input: UserInput) {
  const initialUsername = [input.firstName, input.lastName].join("-").toLowerCase();
  const username = await getAvailableUsername(initialUsername);

  const user = await prisma.user.create({
    data: {
      ...input,
      username,
    },
  });
  await createWishlist(user.id);

  return user;
}

export async function getUserWithRelationsByUsername(username: string): Promise<UserWithRelations> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
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
    throw new UserError("USER_NOT_FOUND");
  }

  if (!user.wishlists.length) {
    throw new WishlistError("WISHLIST_NOT_FOUND");
  }

  return {
    ...omit(["wishlists", "username"], user),
    username: user.username!,
    wishlist: user.wishlists[0],
  };
}

type UserInput = {
  googleId: string;
  email: string;
  emailVerified: boolean;
  image: string;
  firstName: string;
  lastName: string;
};
