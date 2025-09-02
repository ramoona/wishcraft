import { TypedFormData } from "~/lib/form-data/typed-form-data";
import { OnboardingStepInputSchema, SkipOnboardingStepInputSchema } from "~/services/onboarding/schemas";

export const ProcessOnboardingStepFormData = new TypedFormData(OnboardingStepInputSchema);
export const SkipOnboardingStepFormData = new TypedFormData(SkipOnboardingStepInputSchema);
