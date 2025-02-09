import { WishType } from "~/services/wishlist/types";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image: string | null;
  dateOfBirth: string | null;
  defaultCurrency?: string | null;
  showReserved?: boolean | null;
  isOnboarded: boolean | null;
};

export type OtherUser = Pick<User, "id" | "username" | "firstName" | "lastName" | "dateOfBirth" | "image"> & {
  isFriend: boolean;
};

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
    };
