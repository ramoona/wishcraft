export type ServerErrorCode =
  | "UNAUTHORIZED"
  | "UNKNOWN"
  | "INVALID_INPUT"
  | "INTERNAL_SERVER_ERROR"
  | "OAUTH_ERROR"
  | "PRISMA_ERROR";

export class ServerError extends Error {
  readonly errorCode: ServerErrorCode;
  constructor(errorCode: ServerErrorCode) {
    super();
    this.name = "ServerError";
    this.errorCode = errorCode;
  }
}
