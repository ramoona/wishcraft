import { prisma } from "prisma/client";
import { UserError } from "~/services/user/errors";
import { generateUniqueUsername } from "~/utils/uniqueUsername";
import { OtherUser, User, UserActionPayload } from "~/services/user/types";
import { isNil } from "ramda";
import { User as PrismaUser } from "@prisma/client";
import { getSessionUserOrThrow } from "~/services/auth";

export async function updateUsername({ userId, username }: { userId: string; username: string }) {
  if (!username) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  const isUsernameExists = await isUserNameTaken(username);

  if (isUsernameExists) {
    throw new UserError("USERNAME_IS_TAKEN");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { username },
  });
  await logUserAction({ action: "user-updated", changes: { username } });
}

export async function updateDateOfBirth({ userId, dateOfBirth }: { userId: string; dateOfBirth: string }) {
  if (!dateOfBirth) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { dateOfBirth },
  });
  await logUserAction({ action: "user-updated", changes: { dateOfBirth } });
}

export async function updateReservedWishedVisibility({
  userId,
  showReserved,
}: {
  userId: string;
  showReserved: boolean;
}) {
  if (isNil(showReserved)) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { showReserved },
  });

  await logUserAction({ action: "user-updated", changes: { showReserved } });
}

export async function updateDefaultCurrency({ userId, currency }: { userId: string; currency: string }) {
  if (isNil(currency)) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { defaultCurrency: currency },
  });

  await logUserAction({ action: "user-updated", changes: { defaultCurrency: currency } });
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
      wishlists: { create: {} },
    },
  });
  await logUserAction({ action: "user-created", userId: user.id, email: input.email });
  return user;
}

type UserInput = {
  googleId: string;
  email: string;
  emailVerified: boolean;
  image: string;
  firstName: string;
  lastName: string;
};

export async function getUserByUserName(username: string): Promise<OtherUser> {
  const sessionUser = await getSessionUserOrThrow();
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      image: true,
      dateOfBirth: true,
      friends: { where: { OR: [{ friendAId: sessionUser.id }, { friendBId: sessionUser.id }] } },
    },
  });

  if (!user) {
    throw new UserError("USER_NOT_FOUND");
  }

  return { ...toUserBase(user), isFriend: user.friends.length > 0 };
}

function toUserBase(
  user: Pick<PrismaUser, "id" | "firstName" | "lastName" | "username" | "dateOfBirth" | "image">,
): Pick<User, "id" | "firstName" | "lastName" | "username" | "dateOfBirth" | "image"> {
  return { ...user, dateOfBirth: user.dateOfBirth?.toISOString().split("T")[0] || null };
}

export async function logUserAction(payload: UserActionPayload) {
  if (payload.action === "user-created") {
    return prisma.userActionsLog.create({
      data: {
        payload: {
          ...payload,
          userId: payload.userId,
          email: payload.email,
        },
      },
    });
  }

  const sessionUser = await getSessionUserOrThrow();
  await prisma.userActionsLog.create({
    data: {
      payload: {
        ...payload,
        userId: sessionUser.id,
        email: sessionUser.email,
      },
    },
  });
}
