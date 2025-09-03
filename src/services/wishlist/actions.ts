"use server";

import { createWish, deleteWish, reserveWish, releaseWish, updateWish } from "~/services/wishlist/index";
import {
  WishCreationFormData,
  WishDeletionFormData,
  WishlistReservationFormData,
  WishUpdateFormData,
} from "./form-data";
import { omit } from "ramda";
import { getErrorCode, KnownError } from "~/core/errors";

type ActionState = { error?: KnownError["errorCode"] };

export const reserveWishAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const wishId = WishlistReservationFormData.toObject(formData).wishId;
    await reserveWish(wishId);
    return {};
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Wish [reserve] error:", getErrorCode(e));
    return { error: getErrorCode(e) };
  }
};

export const releaseWishAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const wishId = WishlistReservationFormData.toObject(formData).wishId;
    await releaseWish(wishId);
    return {};
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Wish [release] error:", getErrorCode(e));
    return { error: getErrorCode(e) };
  }
};

export const createWishAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const formEntries = WishCreationFormData.toObject(formData);
    await createWish(formEntries);
    return {};
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Wish [create] error:", getErrorCode(e));
    return { error: getErrorCode(e) };
  }
};

export const updateWishAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const formEntries = WishUpdateFormData.toObject(formData);
    await updateWish(formEntries.id, omit(["id"], formEntries));
    return {};
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Wish [update] error:", getErrorCode(e));
    return { error: getErrorCode(e) };
  }
};

export const deleteWishAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const { id } = WishDeletionFormData.toObject(formData);
    await deleteWish(id);
    return {};
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Wish [delete] error:", getErrorCode(e));
    return { error: getErrorCode(e) };
  }
};
