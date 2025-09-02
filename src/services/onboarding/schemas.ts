import { z } from "zod";
import {
  DayOfBirthSchema,
  DefaultCurrencySchema,
  MonthOfBirthSchema,
  ProfileVisibilitySchema,
  ReservedVisibilitySchema,
  UsernameSchema,
} from "~/core/schemas";

export const OnboardingStepInputSchema = z.union([
  z.object({
    type: z.literal("username"),
    username: UsernameSchema,
  }),
  z.object({
    type: z.literal("date-of-birth"),
    dayOfBirth: DayOfBirthSchema,
    monthOfBirth: MonthOfBirthSchema,
  }),
  z.object({
    type: z.literal("reserved-wishes-visibility"),
    showReserved: ReservedVisibilitySchema,
  }),
  z.object({
    type: z.literal("default-currency"),
    currency: DefaultCurrencySchema,
  }),
  z.object({
    type: z.literal("profile-visibility"),
    isProfileHidden: ProfileVisibilitySchema,
  }),
  z.object({
    type: z.literal("first-wish"),
  }),
]);

export const SkipOnboardingStepInputSchema = z.object({
  type: z.enum([
    "username",
    "date-of-birth",
    "reserved-wishes-visibility",
    "default-currency",
    "profile-visibility",
    "first-wish",
  ]),
});
