import { WishlistT } from "~/services/wishlist/types";

export type Types = {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  email: string;
  image: string | null;
};

export type UserWithRelations = Omit<Types, "email" | "username"> & {
  wishlist: WishlistT;
  username: string;
};
