import { prisma } from "prisma/client";
import { UserError } from "~/services/user/errors";
import { OtherUser, User, UserActionPayload, UserOnboardingStep, userOnboardingSteps } from "~/services/user/types";
import { isNil } from "ramda";
import { User as PrismaUser } from "@prisma/client";
import { getSessionUserOrThrow } from "~/services/auth";
import { generateUniqueUsername } from "~/utils/uniqueUsername";

export async function updateUsername({
  userId,
  username,
  onboarding,
}: {
  userId: string;
  username: string;
  onboarding?: boolean;
}): Promise<User> {
  if (!username) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  const isUsernameExists = await isUserNameTaken(username);

  if (isUsernameExists) {
    throw new UserError("USERNAME_IS_TAKEN");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { username, completedOnboardingSteps: onboarding ? { push: "username" } : undefined },
  });
  await logUserAction({ action: "user-updated", changes: { username } });
  return toUser(updated);
}

export async function updateDateOfBirth({
  userId,
  dayOfBirth,
  monthOfBirth,
}: {
  userId: string;
  dayOfBirth: number;
  monthOfBirth: number;
}) {
  if (!dayOfBirth || !monthOfBirth) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { dayOfBirth, monthOfBirth, completedOnboardingSteps: { push: "date-of-birth" } },
  });
  await logUserAction({ action: "user-updated", changes: { dayOfBirth, monthOfBirth } });
  return toUser(updated);
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

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { showReserved, completedOnboardingSteps: { push: "reserved-wishes-visibility" } },
  });

  await logUserAction({ action: "user-updated", changes: { showReserved } });
  return toUser(updated);
}

export async function updateDefaultCurrency({ userId, currency }: { userId: string; currency: string }) {
  if (isNil(currency)) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { defaultCurrency: currency, completedOnboardingSteps: { push: "default-currency" } },
  });

  await logUserAction({ action: "user-updated", changes: { defaultCurrency: currency } });
  return toUser(updated);
}

function isUserNameTaken(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export async function getAvailableUsername(username: string, attempt = 0): Promise<string> {
  if (attempt > 10) {
    throw new UserError("TOO_MANY_ATTEMPTS_TO_GENERATE_USERNAME");
  }

  const isTaken = await isUserNameTaken(username);
  return isTaken ? getAvailableUsername(generateUniqueUsername(), attempt + 1) : username;
}

export async function createUser(input: UserInput) {
  const user = await prisma.user.create({
    data: {
      ...input,
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
      dayOfBirth: true,
      monthOfBirth: true,
      friends: { where: { OR: [{ friendAId: sessionUser.id }, { friendBId: sessionUser.id }] } },
    },
  });

  if (!user) {
    throw new UserError("USER_NOT_FOUND");
  }

  return { ...user, isFriend: user.friends.length > 0 };
}

function toUser(user: PrismaUser): User {
  return {
    ...user,
    completedOnboardingSteps: user.completedOnboardingSteps as UserOnboardingStep[],
  };
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

export function isUserOnboarded(user: User) {
  return userOnboardingSteps.every(step => user.completedOnboardingSteps.includes(step));
}
