import { TypedFormData } from "~/utils/formData";
import { SupportedLanguages } from "~/lib/i18n/settings";

export const UsernameFormData = new TypedFormData<{ username: string }>();
export const DateOfBirthFormData = new TypedFormData<{ dayOfBirth: number; monthOfBirth: number }>();
export const ReservedWishesVisibilityFormData = new TypedFormData<{ showReserved: boolean }>();
export const DefaultCurrencyFormData = new TypedFormData<{ currency: string }>();
export const ProfileVisibilityFormData = new TypedFormData<{ isProfileHidden: boolean }>();
export const LanguageFormData = new TypedFormData<{ language: SupportedLanguages }>();
