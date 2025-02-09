import { TypedFormData } from "~/utils/formData";

export const UsernameFormData = new TypedFormData<{ username: string }>();
export const DateOfBirthFormData = new TypedFormData<{ dateOfBirth: string }>();
export const ReservedWishesVisibilityFormData = new TypedFormData<{ showReserved: string }>();
export const DefaultCurrencyFormData = new TypedFormData<{ currency: string }>();
