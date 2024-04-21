import { Wishlist } from "~/types/wishlist";

export type User = {
  id: string;
  username: string | null;
  email: string;
  name: string | null;
  image: string | null;
};

export type UserWithRelations = User & {
  wishlists: Wishlist[];
};
