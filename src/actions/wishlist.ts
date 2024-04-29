"use server";

import { reserveWish } from "prisma/handlers/wishlist";
import { getServerSession } from "~/auth/getServerSession";
import { PrismaError } from "prisma/errors";
import { WishlistReservationFormData } from "~/actions/formData";

type ActionState = { error?: string };

export const reserveWishAction = async (formData: FormData): Promise<ActionState> => {
  const session = await getServerSession();
  const wishId = WishlistReservationFormData.toObject(formData);

  if (!wishId || typeof wishId !== "string") {
    return { error: "Wish ID is required" };
  }

  if (!session?.user.id) {
    return { error: "Unauthorized" };
  }

  try {
    await reserveWish({ userId: session.user.id, wishId });
    return { error: undefined };
  } catch (e) {
    return { error: e instanceof PrismaError ? e.errorType : "Something went wrong" };
  }
};
