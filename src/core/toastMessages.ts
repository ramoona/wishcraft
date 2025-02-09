import { ServerErrorCode } from "~/services/errors";
import { UserErrorCode } from "~/services/user/errors";
import { WishlistErrorCode } from "~/services/wishlist/errors";

export function getErrorMessage(errorCode: ServerErrorCode | UserErrorCode | WishlistErrorCode) {
  switch (errorCode) {
    case "UNAUTHORIZED":
      return "Unauthorized Access";
    case "INTERNAL_SERVER_ERROR":
      return "Internal Server Error, please try again later";
    case "INVALID_INPUT":
      return "Invalid Input Provided";
    case "OAUTH_ERROR":
      return "OAuth Error, please try again";
    case "USER_NOT_FOUND":
      return "Oops, we could not find this user";
    case "TOO_MANY_ATTEMPTS_TO_GENERATE_USERNAME":
      return "Too many unsuccessful attempts to generate a username, please try again later";
    case "INPUT_IS_REQUIRED":
      return "Input is required";
    case "USERNAME_IS_TAKEN":
      return "The username is already taken, please choose a different one";
    case "WISH_IS_ALREADY_RESERVED":
      return "The wish is already reserved";
    case "WISH_IS_NOT_RESERVABLE":
      return "The wish is not reservable";
    case "WISH_IS_NOT_RESERVED":
      return "The wish is not reserved";
    case "WISH_IS_RESERVED_BY_ANOTHER_USER":
      return "The wish is reserved by another user";
    case "WISH_NOT_FOUND":
      return "Wish not found";
    case "WISHLIST_NOT_FOUND":
      return "Wishlist not found";
    case "UNKNOWN":
    default:
      return "An unknown error occurred";
  }
}

export type SuccessMessageCode = "NEW_WISH_ADDED" | "UPDATED" | "DELETED" | "WISH_RESERVED" | "WISH_UNRESERVED";
export function getSuccessMessage(code: SuccessMessageCode) {
  switch (code) {
    case "NEW_WISH_ADDED":
      return "New wish added!";
    case "UPDATED":
      return "Updates saved!";
    case "DELETED":
      return "Deleted!";
    case "WISH_RESERVED":
      return "Reserved!";
    case "WISH_UNRESERVED":
      return "Unreserved!";
    default:
      return "Success!";
  }
}
