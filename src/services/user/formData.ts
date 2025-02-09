import { TypedFormData } from "~/utils/formData";

type OnboardingData = { onboarding?: boolean };
export const UsernameFormData = new TypedFormData<OnboardingData & { username: string }>();
export const DateOfBirthFormData = new TypedFormData<OnboardingData & { dateOfBirth: string }>();
export const ReservedWishesVisibilityFormData = new TypedFormData<OnboardingData & { showReserved: boolean }>();
export const DefaultCurrencyFormData = new TypedFormData<OnboardingData & { currency: string }>();
