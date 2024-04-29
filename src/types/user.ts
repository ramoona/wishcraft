import { WishlistT } from "~/types/wishlist";

export type User = {
  id: string;
  username: string | null;
  email: string;
  name: string | null;
  image: string | null;
};

export type UserWithRelations = Omit<User, "email" | "username"> & {
  wishlist: WishlistT;
  username: string;
};
