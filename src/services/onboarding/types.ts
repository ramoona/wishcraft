import { z } from "zod";
import { OnboardingStepInputSchema, SkipOnboardingStepInputSchema } from "~/services/onboarding/schemas";

export type OnboardingStepInput = z.infer<typeof OnboardingStepInputSchema>;
export type SkipOnboardingStepInput = z.infer<typeof SkipOnboardingStepInputSchema>;
