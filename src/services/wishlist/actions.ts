"use server";

import {
  createWish,
  deleteWish,
  getWishlistIdByUserId,
  reserveWish,
  releaseWish,
  updateWish,
} from "~/services/wishlist/index";
import { ServerError, ServerErrorCode } from "~/services/errors";
import {
  WishCreationFormData,
  WishDeletionFormData,
  WishlistReservationFormData,
  WishUpdateFormData,
} from "./formData";
import { omit } from "ramda";
import { WishlistError, WishlistErrorCode } from "~/services/wishlist/errors";
import { getSessionUserOrThrow } from "~/services/auth";

type ActionState = { error?: ServerErrorCode | WishlistErrorCode };

export const reserveWishAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const wishId = WishlistReservationFormData.toObject(formData).wishId;
    await reserveWish({ userId: sessionUser.id, wishId });
    return {};
  } catch (e) {
    return { error: getErrorCode(e) };
  }
};

export const releaseWishAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const wishId = WishlistReservationFormData.toObject(formData).wishId;
    await releaseWish({ userId: sessionUser.id, wishId });
    return {};
  } catch (e) {
    return { error: getErrorCode(e) };
  }
};

export const createWishAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const formEntries = WishCreationFormData.toObject(formData);
    const wishlistId = await getWishlistIdByUserId(sessionUser.id);
    await createWish(wishlistId, formEntries);
    return {};
  } catch (e) {
    return { error: getErrorCode(e) };
  }
};

export const updateWishAction = async (formData: FormData): Promise<ActionState> => {
  try {
    await getSessionUserOrThrow();
    const formEntries = WishUpdateFormData.toObject(formData);
    await updateWish(formEntries.id!, omit(["id"], formEntries));
    return {};
  } catch (e) {
    return { error: getErrorCode(e) };
  }
};

export const deleteWishAction = async (formData: FormData): Promise<ActionState> => {
  try {
    await getSessionUserOrThrow();
    const { id } = WishDeletionFormData.toObject(formData);
    await deleteWish(id);
    return {};
  } catch (e) {
    return { error: getErrorCode(e) };
  }
};

function getErrorCode(e: unknown) {
  return e instanceof ServerError || e instanceof WishlistError ? e.errorCode : "UNKNOWN";
}
