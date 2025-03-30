import { TypedFormData } from "~/utils/formData";
import { OnboardingStepInput } from "~/services/onboarding/types";

export const ProcessOnboardingStepFormData = new TypedFormData<OnboardingStepInput>();
export const SkipOnboardingStepFormData = new TypedFormData<Pick<OnboardingStepInput, "type">>();
