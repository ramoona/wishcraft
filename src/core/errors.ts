import { WishlistError } from "~/services/wishlist/errors";
import { ServerError } from "~/services/errors";
import { UserError } from "~/services/user/errors";

export type KnownError = WishlistError | ServerError | UserError;

export function isErrorKnown(error: Error): error is KnownError {
  return error instanceof WishlistError || error instanceof ServerError || error instanceof UserError;
}
