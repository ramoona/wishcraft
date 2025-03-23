import { prisma } from "prisma/db";
import { UserError } from "~/services/user/errors";
import { OtherUser, User, UserActionPayload, UserOnboardingStep, ONBOARDING_STEPS } from "~/services/user/types";
import { isNil } from "ramda";
import { User as PrismaUser } from "@prisma/client";
import { deleteSessionTokenCookie, getSessionUser, getSessionUserOrThrow } from "~/services/session";
import { generateUniqueUsername } from "~/utils/uniqueUsername";

export async function updateUsername({
  username,
  onboarding,
}: {
  username: string;
  onboarding?: boolean;
}): Promise<User> {
  const sessionUser = await getSessionUserOrThrow();

  if (!username) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  const isUsernameExists = await isUserNameTaken(username, sessionUser.id);

  if (isUsernameExists) {
    throw new UserError("USERNAME_IS_TAKEN");
  }

  const updated = await prisma.user.update({
    where: { id: sessionUser.id },
    data: { username, completedOnboardingSteps: onboarding ? { push: "username" } : undefined },
  });
  await logUserAction({ action: "user-updated", changes: { username } });
  return toUser(updated);
}

export async function checkUsernameUniqueness({ username }: { username: string }): Promise<boolean> {
  const sessionUser = await getSessionUserOrThrow();

  if (!username) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  const isUsernameExists = await isUserNameTaken(username, sessionUser.id);

  return !isUsernameExists;
}

export async function updateDateOfBirth({
  dayOfBirth,
  monthOfBirth,
  onboarding,
}: {
  dayOfBirth: number;
  monthOfBirth: number;
  onboarding?: boolean;
}) {
  const sessionUser = await getSessionUserOrThrow();

  if (!dayOfBirth || !monthOfBirth) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  const updated = await prisma.user.update({
    where: { id: sessionUser.id },
    data: { dayOfBirth, monthOfBirth, completedOnboardingSteps: onboarding ? { push: "date-of-birth" } : undefined },
  });
  await logUserAction({ action: "user-updated", changes: { dayOfBirth, monthOfBirth } });
  return toUser(updated);
}

export async function updateReservedWishedVisibility({
  showReserved,
  onboarding,
}: {
  showReserved: boolean;
  onboarding?: boolean;
}) {
  const sessionUser = await getSessionUserOrThrow();

  if (isNil(showReserved)) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  const updated = await prisma.user.update({
    where: { id: sessionUser.id },
    data: { showReserved, completedOnboardingSteps: onboarding ? { push: "reserved-wishes-visibility" } : undefined },
  });

  await logUserAction({ action: "user-updated", changes: { showReserved } });
  return toUser(updated);
}

export async function updateDefaultCurrency({ currency, onboarding }: { currency: string; onboarding?: boolean }) {
  const sessionUser = await getSessionUserOrThrow();

  if (isNil(currency)) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  const updated = await prisma.user.update({
    where: { id: sessionUser.id },
    data: {
      defaultCurrency: currency,
      completedOnboardingSteps: onboarding ? { push: "default-currency" } : undefined,
    },
  });

  await logUserAction({ action: "user-updated", changes: { defaultCurrency: currency } });
  return toUser(updated);
}

export async function updateProfileVisibility({
  isProfileHidden,
  onboarding,
}: {
  isProfileHidden: boolean;
  onboarding?: boolean;
}) {
  const sessionUser = await getSessionUserOrThrow();

  if (isNil(isProfileHidden)) {
    throw new UserError("INPUT_IS_REQUIRED");
  }

  const updated = await prisma.user.update({
    where: { id: sessionUser.id },
    data: { isProfileHidden, completedOnboardingSteps: onboarding ? { push: "profile-visibility" } : undefined },
  });

  await logUserAction({ action: "user-updated", changes: { isProfileHidden } });
  return toUser(updated);
}

async function isUserNameTaken(username: string, currentUserId?: string) {
  const taken = await prisma.user.findFirst({ where: { username, id: { not: currentUserId } } });
  return Boolean(taken);
}

export async function getAvailableUsername(username: string, attempt = 0): Promise<string> {
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
      wishlists: { create: {} },
      username,
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
  const sessionUser = await getSessionUser();
  const friends = await prisma.friend.findMany({
    where: sessionUser ? { OR: [{ friendAId: sessionUser.id }, { friendBId: sessionUser.id }] } : undefined,
    select: {
      friendAId: true,
      friendBId: true,
    },
  });
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
      isProfileHidden: true,
    },
  });

  if (!user) {
    throw new UserError("USER_NOT_FOUND");
  }

  return { ...user, isFriend: friends.length > 0 };
}

export function toUser(user: PrismaUser): User {
  return {
    ...user,
    isOnboarded: isUserOnboarded(user),
    completedOnboardingSteps: user.completedOnboardingSteps as UserOnboardingStep[],
  };
}

export async function deleteCurrentUser() {
  const sessionUser = await getSessionUserOrThrow();
  await prisma.friend.deleteMany({
    where: { OR: [{ friendAId: sessionUser.id }, { friendBId: sessionUser.id }] },
  });
  await prisma.user.delete({ where: { id: sessionUser.id } });
  await logUserAction({ action: "user-deleted", email: sessionUser.email, userId: sessionUser.id });
  await deleteSessionTokenCookie();
}

export async function logUserAction(payload: UserActionPayload) {
  if (payload.action === "user-created" || payload.action === "user-deleted") {
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

export function isUserOnboarded(user: PrismaUser) {
  const stepsToComplete = ONBOARDING_STEPS.filter(
    step => !(step === "reserved-wishes-visibility" && user.isProfileHidden),
  );

  return stepsToComplete.every(step => user.completedOnboardingSteps.includes(step));
}
