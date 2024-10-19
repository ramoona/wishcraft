export type WishlistErrorCode =
  | "WISHLIST_NOT_FOUND"
  | "WISH_NOT_FOUND"
  | "WISH_IS_NOT_RESERVABLE"
  | "WISH_IS_ALREADY_RESERVED"
  | "WISH_IS_RESERVED_BY_ANOTHER_USER"
  | "WISH_IS_NOT_RESERVED";

export class WishlistError extends Error {
  readonly errorCode: WishlistErrorCode;
  constructor(errorType: WishlistErrorCode) {
    super();
    this.name = "WishlistError";
    this.errorCode = errorType;
  }
}
