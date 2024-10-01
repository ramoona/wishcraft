export type PrismaErrorType =
  | "USER_NOT_FOUND"
  | "WISHLIST_NOT_FOUND"
  | "WISH_NOT_FOUND"
  | "WISH_IS_NOT_RESERVABLE"
  | "WISH_IS_ALREADY_RESERVED"
  | "USERNAME_IS_TAKEN";

export class PrismaError extends Error {
  readonly errorType: PrismaErrorType;
  constructor(errorType: PrismaErrorType) {
    super();
    this.name = "PrismaError";
    this.errorType = errorType;
  }
}
