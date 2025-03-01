"use server";

import {
  updateDateOfBirth,
  updateUsername,
  updateReservedWishedVisibility,
  updateDefaultCurrency,
} from "~/services/user/index";
import { ServerError, ServerErrorCode } from "~/services/errors";
import { getSessionUserOrThrow } from "~/services/session";
import { UserError, UserErrorCode } from "~/services/user/errors";
import {
  DateOfBirthFormData,
  UsernameFormData,
  ReservedWishesVisibilityFormData,
  DefaultCurrencyFormData,
} from "~/services/user/formData";
import { User } from "~/services/user/types";

type ActionState = { error: ServerErrorCode | UserErrorCode; user: undefined } | { error: undefined; user: User };

export const updateUsernameAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const user = await updateUsername({ userId: sessionUser.id, ...UsernameFormData.toObject(formData) });
    return { user, error: undefined };
  } catch (e) {
    return { error: getErrorCode(e), user: undefined };
  }
};

export const updateDateOfBirthAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const user = await updateDateOfBirth({ userId: sessionUser.id, ...DateOfBirthFormData.toObject(formData) });
    return { user, error: undefined };
  } catch (e) {
    return { error: getErrorCode(e), user: undefined };
  }
};

export const updateReservedWishesVisibilityAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const user = await updateReservedWishedVisibility({
      userId: sessionUser.id,
      ...ReservedWishesVisibilityFormData.toObject(formData),
    });
    return { user, error: undefined };
  } catch (e) {
    return { error: getErrorCode(e), user: undefined };
  }
};

export const updateDefaultCurrencyAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const user = await updateDefaultCurrency({ userId: sessionUser.id, ...DefaultCurrencyFormData.toObject(formData) });
    return { user, error: undefined };
  } catch (e) {
    return { error: getErrorCode(e), user: undefined };
  }
};

function getErrorCode(e: unknown) {
  return e instanceof ServerError || e instanceof UserError ? e.errorCode : "UNKNOWN";
}
