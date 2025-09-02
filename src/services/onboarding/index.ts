import { getSessionUserOrThrow } from "~/services/session";
import { prisma } from "prisma/db";
import { OnboardingStepInput, SkipOnboardingStepInput } from "~/services/onboarding/types";
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

  switch (input.type) {
    case "username":
      await updateUsername(input.username);
      break;
    case "date-of-birth":
      await updateDateOfBirth(input);
      break;
    case "profile-visibility":
      await updateProfileVisibility(input.isProfileHidden);
      break;
    case "reserved-wishes-visibility":
      await updateReservedWishedVisibility(input.showReserved);
      break;
    case "default-currency":
      await updateDefaultCurrency(input.currency);
      break;
  }

  const updated = await prisma.user.update({
    where: { id: sessionUser.id },
    data: { completedOnboardingSteps: { push: input.type } },
  });

  return toUser(updated);
}

export async function skipOnboardingStep({ type }: SkipOnboardingStepInput) {
  const sessionUser = await getSessionUserOrThrow();

  const updated = await prisma.user.update({
    where: { id: sessionUser.id },
    data: { completedOnboardingSteps: { push: type } },
  });

  return toUser(updated);
}
