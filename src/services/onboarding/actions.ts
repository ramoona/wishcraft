"use server";

import { User } from "~/services/user/types";
import { processOnboardingStep, skipOnboardingStep } from "~/services/onboarding/index";
import { ProcessOnboardingStepFormData, SkipOnboardingStepFormData } from "~/services/onboarding/form-data";
import { getErrorCode, KnownError } from "~/core/errors";

type ActionState = { error: KnownError["errorCode"]; user: undefined } | { error: undefined; user: User };

export const processOnboardingStepAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const user = await processOnboardingStep(ProcessOnboardingStepFormData.toObject(formData));
    return { user, error: undefined };
  } catch (e) {
    return { error: getErrorCode(e), user: undefined };
  }
};

export const skipOnboardingStepAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const user = await skipOnboardingStep(SkipOnboardingStepFormData.toObject(formData));
    return { user, error: undefined };
  } catch (e) {
    return { error: getErrorCode(e), user: undefined };
  }
};
