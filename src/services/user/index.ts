import { prisma } from "prisma/client";
import { UserError } from "~/services/user/errors";
import { generateUniqueUsername } from "~/utils/uniqueUsername";
import { User } from "~/services/user/types";
import { isNil } from "ramda";

const USER_FIELDS_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  username: true,
  email: true,
  image: true,
  dateOfBirth: true,
  defaultCurrency: true,
  showReserved: true,
};

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
}

export async function updateDateOfBirth({ userId, dateOfBirth }: { userId: string; dateOfBirth: string }) {
  if (!dateOfBirth) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { dateOfBirth },
  });
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
}

export async function updateDefaultCurrency({ userId, currency }: { userId: string; currency: string }) {
  if (isNil(currency)) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { defaultCurrency: currency },
  });
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

  return prisma.user.create({
    data: {
      ...input,
      username,
      wishlists: { create: {} },
    },
  });
}

type UserInput = {
  googleId: string;
  email: string;
  emailVerified: boolean;
  image: string;
  firstName: string;
  lastName: string;
};

export async function getUserByUserName(username: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { username }, select: USER_FIELDS_SELECT });

  if (!user) {
    throw new UserError("USER_NOT_FOUND");
  }

  return { ...user, dateOfBirth: user.dateOfBirth?.toISOString().split("T")[0] || null };
}
