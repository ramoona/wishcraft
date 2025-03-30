"use server";

import { ServerError, ServerErrorCode } from "~/services/errors";
import { UserError, UserErrorCode } from "~/services/user/errors";

import { User } from "~/services/user/types";
import { processOnboardingStep, skipOnboardingStep } from "~/services/onboarding/index";
import { ProcessOnboardingStepFormData, SkipOnboardingStepFormData } from "~/services/onboarding/formData";

type ActionState = { error: ServerErrorCode | UserErrorCode; user: undefined } | { error: undefined; user: User };

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

function getErrorCode(e: unknown) {
  return e instanceof ServerError || e instanceof UserError ? e.errorCode : "UNKNOWN";
}
