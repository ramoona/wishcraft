import { WishlistT } from "~/services/wishlist/types";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image: string | null;
};

export type UserWithRelations = Omit<User, "email" | "username"> & {
  wishlist: WishlistT;
  username: string;
};
