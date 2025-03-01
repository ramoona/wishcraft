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
import { getSessionUserOrThrow } from "~/services/session";
import { Prisma } from "@prisma/client";

type ActionState = { error?: ServerErrorCode | WishlistErrorCode };

export const reserveWishAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const wishId = WishlistReservationFormData.toObject(formData).wishId;
    await reserveWish({ userId: sessionUser.id, wishId });
    return {};
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Wish [reserve] error:", getErrorCode(e));
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
    // eslint-disable-next-line no-console
    console.error("Wish [release] error:", getErrorCode(e));
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
    // eslint-disable-next-line no-console
    console.error("Wish [create] error:", getErrorCode(e));
    return { error: getErrorCode(e) };
  }
};

export const updateWishAction = async (formData: FormData): Promise<ActionState> => {
  try {
    await getSessionUserOrThrow();
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
    await getSessionUserOrThrow();
    // eslint-disable-next-line no-console
    console.info("Checked authentication");
    const { id } = WishDeletionFormData.toObject(formData);
    // eslint-disable-next-line no-console
    console.info("Converted form data to object", id);
    await deleteWish(id);
    return {};
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Wish [delete] error:", getErrorCode(e));
    return { error: getErrorCode(e) };
  }
};

function getErrorCode(e: unknown) {
  if (e instanceof ServerError || e instanceof WishlistError) {
    return e.errorCode;
  }
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    // eslint-disable-next-line no-console
    console.error("Prisma error: ", e.message);
    return "PRISMA_ERROR";
  }
  if (e instanceof Prisma.PrismaClientUnknownRequestError) {
    // eslint-disable-next-line no-console
    console.error("Prisma error: ", e.message);
    return "PRISMA_ERROR";
  }
  if (e instanceof Prisma.PrismaClientValidationError) {
    // eslint-disable-next-line no-console
    console.error("Prisma error: ", e.message);
    return "PRISMA_ERROR";
  }

  if (e instanceof Error) {
    // eslint-disable-next-line no-console
    console.error("Unknown error:", e.message, e.name);
  }

  return "UNKNOWN";
}
