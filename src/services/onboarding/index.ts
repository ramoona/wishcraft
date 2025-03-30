import { getSessionUserOrThrow } from "~/services/session";
import { prisma } from "prisma/db";
import {
  isDateOfBirthInput,
  isDefaultCurrencyInput,
  isProfileVisibilityInput,
  isReservedWishesVisibilityInput,
  isUsernameInput,
  OnboardingStepInput,
  OnboardingStepType,
} from "~/services/onboarding/types";
import {
  toUser,
  updateDateOfBirth,
  updateDefaultCurrency,
  updateProfileVisibility,
  updateReservedWishedVisibility,
  updateUsername,
} from "~/services/user";
import { User } from "~/services/user/types";

export async function processOnboardingStep(input: OnboardingStepInput): Promise<User> {
  const sessionUser = await getSessionUserOrThrow();

  if (isUsernameInput(input)) {
    await updateUsername(input.username);
  }

  if (isDateOfBirthInput(input)) {
    await updateDateOfBirth(input);
  }

  if (isReservedWishesVisibilityInput(input)) {
    await updateReservedWishedVisibility(input.showReserved);
  }

  if (isDefaultCurrencyInput(input)) {
    await updateDefaultCurrency(input.currency);
  }

  if (isProfileVisibilityInput(input)) {
    await updateProfileVisibility(input.isProfileHidden);
  }

  const updated = await prisma.user.update({
    where: { id: sessionUser.id },
    data: { completedOnboardingSteps: { push: input.type } },
  });

  return toUser(updated);
}

export async function skipOnboardingStep({ type }: { type: OnboardingStepType }) {
  const sessionUser = await getSessionUserOrThrow();

  const updated = await prisma.user.update({
    where: { id: sessionUser.id },
    data: { completedOnboardingSteps: { push: type } },
  });

  return toUser(updated);
}
