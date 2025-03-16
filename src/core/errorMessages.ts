import { ServerErrorCode } from "~/services/errors";
import { UserErrorCode } from "~/services/user/errors";
import { WishlistErrorCode } from "~/services/wishlist/errors";
import { TFunction } from "i18next";

export function getErrorMessage(
  errorCode: ServerErrorCode | UserErrorCode | WishlistErrorCode,
  t: TFunction,
  context?: Record<string, string>,
) {
  const i18nKey = getErrorMessageI18nKeyByErrorCode(errorCode);
  return t(i18nKey, context);
}

export function getSuccessMessage(successCode: SuccessMessageCode, t: TFunction, context?: Record<string, string>) {
  const i18nKey = getSuccessMessageI18nKeyByErrorCode(successCode);
  return t(i18nKey, context);
}

export type SuccessMessageCode = "DELETED" | "SAVED";

export function getSuccessMessageI18nKeyByErrorCode(code: SuccessMessageCode) {
  return successMessages[code];
}

function getErrorMessageI18nKeyByErrorCode(errorCode: ServerErrorCode | UserErrorCode | WishlistErrorCode) {
  return errors[errorCode] || "error.unknown";
}

const errors: Record<ServerErrorCode | UserErrorCode | WishlistErrorCode, string> = {
  UNAUTHORIZED: "error.UNAUTHORIZED",
  OAUTH_ERROR: "error.OAUTH_ERROR",
  USER_NOT_FOUND: "error.USER_NOT_FOUND",
  WISHLIST_NOT_FOUND: "error.USER_NOT_FOUND",
  INPUT_IS_REQUIRED: "error.INPUT_IS_REQUIRED",
  USERNAME_IS_TAKEN: "error.USERNAME_IS_TAKEN",
  WISH_IS_ALREADY_RESERVED: "error.WISH_IS_ALREADY_RESERVED",
  WISH_IS_NOT_RESERVABLE: "error.WISH_IS_NOT_RESERVABLE",
  WISH_IS_NOT_RESERVED: "error.wishIsNotReserved",
  WISH_IS_RESERVED_BY_ANOTHER_USER: "error.wishIsReservedByAnotherUser",
  WISH_NOT_FOUND: "error.wishNotFound",
  INVALID_INPUT: "error.invalidInput",
  TOO_MANY_ATTEMPTS_TO_GENERATE_USERNAME: "error.tooManyAttemptsToGenerateUsername",
  INTERNAL_SERVER_ERROR: "error.UNKNOWN",
  PRISMA_ERROR: "error.UNKNOWN",
  UNKNOWN: "error.UNKNOWN",
};

const successMessages: Record<SuccessMessageCode, string> = {
  SAVED: "success.SAVED",
  DELETED: "success.DELETED",
};
