"use server";

import {
  updateDateOfBirth,
  updateReservedWishedVisibility,
  updateDefaultCurrency,
  checkUsernameUniqueness,
  deleteCurrentUser,
  updateProfileVisibility,
  updateLanguage,
} from "~/services/user/index";
import {
  DateOfBirthFormData,
  UsernameFormData,
  ReservedWishesVisibilityFormData,
  DefaultCurrencyFormData,
  ProfileVisibilityFormData,
  LanguageFormData,
} from "~/services/user/form-data";
import { User } from "~/services/user/types";
import { getErrorCode, KnownError } from "~/core/errors";

type ActionState = { error: KnownError["errorCode"]; user: undefined } | { error: undefined; user: User };
type UsernameUniquenessActionState =
  | { error: KnownError["errorCode"]; isUnique: undefined }
  | { error: undefined; isUnique: boolean };
type DeleteUserActionState = { error?: KnownError["errorCode"] };

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
    await deleteCurrentUser();
    return { error: undefined };
  } catch (e) {
    return { error: getErrorCode(e) };
  }
};
