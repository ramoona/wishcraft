import { TypedFormData } from "~/lib/form-data/typed-form-data";
import { z } from "zod";
import {
  DayOfBirthSchema,
  DefaultCurrencySchema,
  LanguageSchema,
  MonthOfBirthSchema,
  ProfileVisibilitySchema,
  ReservedVisibilitySchema,
  UsernameSchema,
} from "~/core/schemas";

export const UsernameFormData = new TypedFormData(z.object({ username: UsernameSchema }));
export const DateOfBirthFormData = new TypedFormData(
  z.object({
    dayOfBirth: DayOfBirthSchema,
    monthOfBirth: MonthOfBirthSchema,
  }),
);
export const ReservedWishesVisibilityFormData = new TypedFormData(z.object({ showReserved: ReservedVisibilitySchema }));
export const DefaultCurrencyFormData = new TypedFormData(z.object({ currency: DefaultCurrencySchema }));
export const ProfileVisibilityFormData = new TypedFormData(z.object({ isProfileHidden: ProfileVisibilitySchema }));
export const LanguageFormData = new TypedFormData(z.object({ language: LanguageSchema }));
