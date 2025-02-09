export type UserErrorCode =
  | "INPUT_IS_REQUIRED"
  | "USER_NOT_FOUND"
  | "USERNAME_IS_TAKEN"
  | "TOO_MANY_ATTEMPTS_TO_GENERATE_USERNAME";

export class UserError extends Error {
  readonly errorCode: UserErrorCode;
  constructor(errorCode: UserErrorCode) {
    super();
    this.name = "UserError";
    this.errorCode = errorCode;
  }
}
