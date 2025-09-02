import { z } from "zod";
import { languages } from "~/lib/i18n/settings";

export const UsernameSchema = z.string().min(1);
export const DayOfBirthSchema = z.number().min(1).max(31);
export const MonthOfBirthSchema = z.number().min(1).max(12);
export const ReservedVisibilitySchema = z.boolean();
// @TODO: add enum for currencies
export const DefaultCurrencySchema = z.string().min(1);
export const ProfileVisibilitySchema = z.boolean();
export const LanguageSchema = z.enum(languages);
