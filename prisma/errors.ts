export type PrismaErrorTypes = "USER_NOT_FOUND" | "WISHLIST_NOT_FOUND" | "USERNAME_IS_TAKEN";

export class PrismaError extends Error {
  readonly errorType: PrismaErrorTypes;
  constructor(errorType: PrismaErrorTypes) {
    super();
    this.name = "PrismaError";
    this.errorType = errorType;
  }
}
