"use server";

import { createWish, deleteWish, getWishlistIdByUserId, reserveWish, updateWish } from "prisma/handlers/wishlist";
import { PrismaError } from "prisma/errors";
import {
  WishCreationFormData,
  WishDeletionFormData,
  WishlistReservationFormData,
  WishUpdateFormData,
} from "~/actions/formData";
import { omit } from "ramda";
import { getSessionUser } from "~/auth/getSessionUser";

type ActionState = { error?: string };

export const reserveWishAction = async (formData: FormData): Promise<ActionState> => {
  const sessionUser = await getSessionUser();
  const wishId = WishlistReservationFormData.toObject(formData).wishId;

  if (!wishId || typeof wishId !== "string") {
    return { error: "Wish ID is required" };
  }

  if (!sessionUser) {
    return { error: "Unauthorized" };
  }

  try {
    await reserveWish({ userId: sessionUser.id, wishId });
    return { error: undefined };
  } catch (e) {
    return { error: e instanceof PrismaError ? e.errorType : "Something went wrong" };
  }
};

export const createWishAction = async (formData: FormData): Promise<ActionState> => {
  const sessionUser = await getSessionUser();
  const formEntries = WishCreationFormData.toObject(formData);

  if (!sessionUser) {
    return { error: "Unauthorized" };
  }

  try {
    const wishlistId = await getWishlistIdByUserId(sessionUser.id);
    await createWish(wishlistId, formEntries);
    return { error: undefined };
  } catch (e) {
    return { error: e instanceof PrismaError ? e.errorType : "Something went wrong" };
  }
};

export const updateWishAction = async (formData: FormData): Promise<ActionState> => {
  const sessionUser = await getSessionUser();
  const formEntries = WishUpdateFormData.toObject(formData);

  if (!sessionUser) {
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
  const sessionUser = await getSessionUser();
  const formEntries = WishDeletionFormData.toObject(formData);

  if (!sessionUser) {
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
