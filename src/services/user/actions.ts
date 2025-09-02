"use server";

import {
  updateDateOfBirth,
  updateUsername,
  updateReservedWishedVisibility,
  updateDefaultCurrency,
  checkUsernameUniqueness,
  deleteCurrentUser,
  updateProfileVisibility,
  updateLanguage,
} from "~/services/user/index";
import { ServerError, ServerErrorCode } from "~/services/errors";
import { getSessionUserOrThrow } from "~/services/session";
import { UserError, UserErrorCode } from "~/services/user/errors";
import {
  DateOfBirthFormData,
  UsernameFormData,
  ReservedWishesVisibilityFormData,
  DefaultCurrencyFormData,
  ProfileVisibilityFormData,
  LanguageFormData,
} from "~/services/user/form-data";
import { User } from "~/services/user/types";

type ActionState = { error: ServerErrorCode | UserErrorCode; user: undefined } | { error: undefined; user: User };
type UsernameUniquenessActionState =
  | { error: ServerErrorCode | UserErrorCode; isUnique: undefined }
  | { error: undefined; isUnique: boolean };
type DeleteUserActionState = { error?: ServerErrorCode | UserErrorCode };

export const updateUsernameAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const user = await updateUsername(UsernameFormData.toObject(formData).username);
    return { user, error: undefined };
  } catch (e) {
    return { error: getErrorCode(e), user: undefined };
  }
};

export const checkUsernameUniquenessAction = async (formData: FormData): Promise<UsernameUniquenessActionState> => {
  try {
    const isUnique = await checkUsernameUniqueness(UsernameFormData.toObject(formData));
    return { isUnique, error: undefined };
  } catch (e) {
    return { error: getErrorCode(e), isUnique: undefined };
  }
};

export const updateDateOfBirthAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const user = await updateDateOfBirth(DateOfBirthFormData.toObject(formData));
    return { user, error: undefined };
  } catch (e) {
    return { error: getErrorCode(e), user: undefined };
  }
};

export const updateReservedWishesVisibilityAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const user = await updateReservedWishedVisibility(ReservedWishesVisibilityFormData.toObject(formData).showReserved);
    return { user, error: undefined };
  } catch (e) {
    return { error: getErrorCode(e), user: undefined };
  }
};

export const updateDefaultCurrencyAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const user = await updateDefaultCurrency(DefaultCurrencyFormData.toObject(formData).currency);
    return { user, error: undefined };
  } catch (e) {
    return { error: getErrorCode(e), user: undefined };
  }
};

export const updateProfileVisibilityAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const user = await updateProfileVisibility(ProfileVisibilityFormData.toObject(formData).isProfileHidden);
    return { user, error: undefined };
  } catch (e) {
    return { error: getErrorCode(e), user: undefined };
  }
};

export const updateLanguageAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const user = await updateLanguage(LanguageFormData.toObject(formData).language);
    return { user, error: undefined };
  } catch (e) {
    return { error: getErrorCode(e), user: undefined };
  }
};

export const deleteUserAccountAction = async (): Promise<DeleteUserActionState> => {
  try {
    await getSessionUserOrThrow();
    await deleteCurrentUser();
    return { error: undefined };
  } catch (e) {
    return { error: getErrorCode(e) };
  }
};

function getErrorCode(e: unknown) {
  return e instanceof ServerError || e instanceof UserError ? e.errorCode : "UNKNOWN";
}
