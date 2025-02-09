"use server";

import {
  updateDateOfBirth,
  updateUsername,
  updateReservedWishedVisibility,
  updateDefaultCurrency,
} from "~/services/user/index";
import { ServerError, ServerErrorCode } from "~/services/errors";
import { getSessionUserOrThrow } from "~/services/auth";
import { UserError, UserErrorCode } from "~/services/user/errors";
import {
  DateOfBirthFormData,
  UsernameFormData,
  ReservedWishesVisibilityFormData,
  DefaultCurrencyFormData,
} from "~/services/user/formData";

type ActionState = { error?: ServerErrorCode | UserErrorCode };

export const updateUsernameAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const username = UsernameFormData.toObject(formData).username;

    await updateUsername({ userId: sessionUser.id, username });
    return { error: undefined };
  } catch (e) {
    return {
      error: getErrorCode(e),
    };
  }
};

export const updateDateOfBirthAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const dateOfBirth = DateOfBirthFormData.toObject(formData).dateOfBirth;

    await updateDateOfBirth({ userId: sessionUser.id, dateOfBirth });
    return { error: undefined };
  } catch (e) {
    return {
      error: getErrorCode(e),
    };
  }
};

export const updateReservedWishesVisibilityAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const showReserved = ReservedWishesVisibilityFormData.toObject(formData).showReserved;

    await updateReservedWishedVisibility({ userId: sessionUser.id, showReserved });
    return { error: undefined };
  } catch (e) {
    return {
      error: getErrorCode(e),
    };
  }
};

export const updateDefaultCurrencyAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const currency = DefaultCurrencyFormData.toObject(formData).currency;

    await updateDefaultCurrency({ userId: sessionUser.id, currency });
    return { error: undefined };
  } catch (e) {
    return {
      error: getErrorCode(e),
    };
  }
};

function getErrorCode(e: unknown) {
  return e instanceof ServerError || e instanceof UserError ? e.errorCode : "UNKNOWN";
}
