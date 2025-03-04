import { TypedFormData } from "~/utils/formData";

type OnboardingData = { onboarding?: boolean };
export const UsernameFormData = new TypedFormData<OnboardingData & { username: string }>();
export const DateOfBirthFormData = new TypedFormData<OnboardingData & { dayOfBirth: number; monthOfBirth: number }>();
export const ReservedWishesVisibilityFormData = new TypedFormData<OnboardingData & { showReserved: boolean }>();
export const DefaultCurrencyFormData = new TypedFormData<OnboardingData & { currency: string }>();
export const ProfileVisibilityFormData = new TypedFormData<OnboardingData & { isProfileHidden: boolean }>();
