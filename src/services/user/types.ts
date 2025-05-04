import { WishType } from "~/services/wishlist/types";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image: string | null;
  dayOfBirth: number | null;
  monthOfBirth: number | null;
  defaultCurrency?: string | null;
  showReserved?: boolean | null;
  completedOnboardingSteps: UserOnboardingStep[];
  isProfileHidden?: boolean | null;
  isOnboarded: boolean;
};

export type OtherUser = Pick<
  User,
  "id" | "username" | "firstName" | "lastName" | "dayOfBirth" | "monthOfBirth" | "image" | "isProfileHidden"
> & {
  isFriend: boolean;
};

export type FriendUser = Pick<
  User,
  "id" | "username" | "firstName" | "lastName" | "dayOfBirth" | "monthOfBirth" | "image"
> & {
  recentWishes: Pick<WishType, "name">[];
};

export const ONBOARDING_STEPS = [
  "username",
  "profile-visibility",
  "date-of-birth",
  "default-currency",
  "reserved-wishes-visibility",
  "first-wish",
] as const;

export type UserOnboardingStep = (typeof ONBOARDING_STEPS)[number];

export type UserActionPayload =
  | {
      userId: string;
      email: string;
      action: "user-created";
    }
  | {
      action: "user-updated";
      changes: Partial<User>;
    }
  | {
      action: "friend-added";
      friendId: string;
    }
  | {
      action: "friend-removed";
      friendId: string;
    }
  | {
      action: "wish-created";
      wish: Partial<WishType>;
    }
  | {
      action: "wish-updated";
      changes: Partial<WishType>;
    }
  | {
      action: "wish-deleted";
      wishId: string;
    }
  | {
      action: "wish-reserved";
      wishId: string;
      reservedById: string;
    }
  | {
      action: "wish-released";
      wishId: string;
      reservedById: string;
    }
  | {
      userId: string;
      email: string;
      action: "user-deleted";
    };
