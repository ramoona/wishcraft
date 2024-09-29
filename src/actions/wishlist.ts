"use server";

import { createWish, deleteWish, getWishlistIdByUserId, reserveWish, updateWish } from "prisma/handlers/wishlist";
import { getServerSession } from "~/auth/getServerSession";
import { PrismaError } from "prisma/errors";
import {
  WishCreationFormData,
  WishDeletionFormData,
  WishlistReservationFormData,
  WishUpdateFormData,
} from "~/actions/formData";
import { omit } from "ramda";

type ActionState = { error?: string };

export const reserveWishAction = async (formData: FormData): Promise<ActionState> => {
  const session = await getServerSession();
  const wishId = WishlistReservationFormData.toObject(formData).wishId;

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

export const createWishAction = async (formData: FormData): Promise<ActionState> => {
  const session = await getServerSession();
  const formEntries = WishCreationFormData.toObject(formData);

  if (!session?.user.id) {
    return { error: "Unauthorized" };
  }

  try {
    const wishlistId = await getWishlistIdByUserId(session.user.id);
    await createWish(wishlistId, formEntries);
    return { error: undefined };
  } catch (e) {
    return { error: e instanceof PrismaError ? e.errorType : "Something went wrong" };
  }
};

export const updateWishAction = async (formData: FormData): Promise<ActionState> => {
  const session = await getServerSession();
  const formEntries = WishUpdateFormData.toObject(formData);

  if (!session?.user.id) {
    return { error: "Unauthorized" };
  }

  if (!formEntries.id) {
    return { error: "Wish ID is required" };
  }

  try {
    await updateWish(formEntries.id, omit(["id"], formEntries));
    return { error: undefined };
  } catch (e) {
    return { error: e instanceof PrismaError ? e.errorType : "Something went wrong" };
  }
};

export const deleteWishAction = async (formData: FormData): Promise<ActionState> => {
  const session = await getServerSession();
  const formEntries = WishDeletionFormData.toObject(formData);

  if (!session?.user.id) {
    return { error: "Unauthorized" };
  }

  if (!formEntries.id) {
    return { error: "Wish ID is required" };
  }

  try {
    await deleteWish(formEntries.id);
    return { error: undefined };
  } catch (e) {
    return { error: e instanceof PrismaError ? e.errorType : "Something went wrong" };
  }
};
