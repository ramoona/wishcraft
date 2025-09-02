import { WishStatus } from "@prisma/client";

const visuals = {
  shape: "shape-1",
  mainColor: "yellow",
  accentColor: "gray",
  backgroundColor: "purple",
  backgroundPositionX: 0,
  backgroundPositionY: 0,
};

export const Frodo: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  wishlistId: string;
  wishes: {
    id: string;
    wishlistId: string;
    name: string;
    comment?: string;
    url?: string;
    price?: number;
    currency?: string;
    reservedById?: string;
    status: WishStatus;
    isPrivate?: boolean;
  }[];
} = {
  firstName: "Frodo",
  lastName: "Baggins",
  username: "frodo-baggins",
  email: "frodo-baggins@mywishcraft.app",
  wishlistId: "wishlist-1",
  wishes: [
    {
      id: "wish-1",
      wishlistId: "wishlist-1",
      name: "Hobbiton-scented candle",
      comment: "Notes of freshly baked seed cakes, pipe smoke, and damp moss.",
      status: "ACTIVE",
      isPrivate: false,
      ...visuals,
    },
    {
      id: "wish-2",
      wishlistId: "wishlist-1",
      name: "Replica One Ring (non-evil)",
      status: "ACTIVE",
      isPrivate: false,
      ...visuals,
    },
    {
      id: "wish-3",
      wishlistId: "wishlist-1",
      name: "Glow-in-the-dark Sting letter opener",
      comment: "Glows blue when junk mail approaches.",
      status: "FULFILLED",
      isPrivate: false,
      ...visuals,
    },
    {
      id: "wish-4",
      wishlistId: "wishlist-1",
      name: "Vacation in the Shire poster",
      comment: "Rolling hills, round doors, and no orcs in sight.",
      url: "https://mywishcraft.app",
      price: 22.99,
      currency: "EUR",
      status: "ARCHIVED",
      isPrivate: false,
      ...visuals,
    },
    {
      id: "wish-5",
      wishlistId: "wishlist-1",
      name: "Self-refilling pipeweed pouch",
      comment: "No need to visit Southfarthing weekly.",
      isPrivate: true,
      status: "ACTIVE",
      ...visuals,
    },
  ],
};
